import { Balance, CounterpartyClient } from 'counterparty-node-client';
import chunk from 'lodash/chunk';
import orderBy from 'lodash/orderBy';
import prisma from '../data';
import type { PepeList, ProjectName } from '../packages/projects';

export const sync = async (assetGetter: () => Promise<PepeList>, projectSlug: ProjectName) => {
  console.log('getting assetNames');
  const xcpAssets = await assetGetter();
  const assetNames = Object.keys(xcpAssets);
  console.log(`got ${assetNames.length} asset names`);

  const addyToAssets: Record<string, { assetName: string; quantity: number }[]> = {};
  const cpClient = new CounterpartyClient('http://api.counterparty.io:4000/api/', 'rpc', 'rpc');
  let offset = 0;

  while (true) {
    const chunkedAssetNames = chunk(assetNames, 750);
    const balances: Balance[] = [];

    console.log('getting asset balances for assets', { chunkedAssetNames });
    for (const assetNames of chunkedAssetNames) {
      const balancesChunk = await cpClient.getBalances({
        filters: [
          // consider burn addresses
          { field: 'address', op: 'NOT IN', value: ['1BitcornCropsMuseumAddressy149ZDr'] },
          { field: 'asset', op: 'IN', value: assetNames },
          { field: 'quantity', op: '>', value: 0 },
        ],
        offset,
      });
      balances.push(...balancesChunk);
    }

    if (!balances.length) break;

    for (const { address, asset, quantity } of balances) {
      const addyAsset = { assetName: asset, quantity };
      if (addyToAssets[address]) {
        addyToAssets[address].push(addyAsset);
      } else {
        addyToAssets[address] = [addyAsset];
      }
    }

    offset += 1000;
  }

  for (const [address, assets] of Object.entries(addyToAssets)) {
    addyToAssets[address] = orderBy(assets, [
      (asset) => {
        const ape = xcpAssets[asset.assetName];
        return ape.series;
      },
      (asset) => {
        const ape = xcpAssets[asset.assetName];
        return ape.order;
      },
    ]);
  }

  console.log('creating addresses');
  await prisma.address.createMany({
    data: Object.keys(addyToAssets).map((address) => ({ address })),
    skipDuplicates: true,
  });

  console.log('deleting old addressProjectDetails');
  await prisma.addressProjectDetails.deleteMany({ where: { projectSlug } });

  const sortedAddyToAssets = orderBy(
    Object.entries(addyToAssets),
    [
      ([_, assets]) => {
        if (assets.length === assetNames.length) return 0;
        return 1;
      },
      ([_, assets]) => assets.length,
      ([_, assets]) => assets.reduce((acc, asset) => acc + asset.quantity, 0),
    ],
    ['asc', 'desc', 'desc']
  );

  console.log('updating project and creating addressProjectDetails');
  await Promise.all([
    prisma.project.update({
      data: { assetCount: assetNames.length },
      where: { slug: projectSlug },
    }),
    prisma.addressProjectDetails
      .createMany({
        data: sortedAddyToAssets.map(([address, assets], i) => ({
          addressId: address,
          assets,
          projectSlug,
          rank: i,
        })),
        skipDuplicates: true,
      })
      .catch((e) => console.error(e)),
  ]);

  console.log(`done syncing ${projectSlug}`);
};
