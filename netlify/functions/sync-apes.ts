import { PrismaClient } from '@prisma/client';
import { Handler, schedule } from '@netlify/functions';
import { CounterpartyClient } from 'counterparty-node-client';
import orderBy from 'lodash/orderBy';
import fetch from 'node-fetch';

const unscheduledHandler: Handler = async function () {
  const apes = await getDabcList();
  const apeNames = Object.keys(apes);

  const cpClient = new CounterpartyClient('http://api.counterparty.io:4000/api/', 'rpc', 'rpc');

  const addyToAssets: Record<string, { assetName: string; quantity: number }[]> = {};
  let offset = 0;
  while (true) {
    const balances = await cpClient.getBalances({
      filters: [
        { field: 'asset', op: 'IN', value: apeNames },
        { field: 'quantity', op: '>', value: 0 },
      ],
      offset,
    });
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
        const ape = apes[asset.assetName];
        return ape.series;
      },
      (asset) => {
        const ape = apes[asset.assetName];
        return ape.order;
      },
    ]);
  }

  const prisma = new PrismaClient();
  await prisma.address.createMany({
    data: Object.keys(addyToAssets).map((address) => ({ address })),
    skipDuplicates: true,
  });

  await prisma.addressAssets.deleteMany({
    where: { projectId: 'ed7e7655-6695-4420-bc30-a60823fa0153' },
  });

  const sortedAddyToAssets = orderBy(
    Object.entries(addyToAssets),
    [
      ([_, assets]) => {
        if (assets.length === apeNames.length) return 0;
        return 1;
      },
      ([_, assets]) => assets.length,
      ([_, assets]) => assets.reduce((acc, asset) => acc + asset.quantity, 0),
    ],
    ['asc', 'desc', 'desc']
  );
  console.log({ sortedAddyToAssets });
  await prisma.addressAssets
    .createMany({
      data: sortedAddyToAssets.map(([address, assets], i) => ({
        addressId: address,
        assets,
        projectId: 'ed7e7655-6695-4420-bc30-a60823fa0153',
        rank: i,
      })),
      skipDuplicates: true,
    })
    .catch((e) => console.error(e));

  return { statusCode: 200 };
};

const getDabcList = async (): Promise<PepeList> => {
  try {
    const pepesResponse = await fetch('https://droolingapebus.club/api/verbose-feed');
    const pepeJson = (await pepesResponse.json()) as PepeList;
    return Object.entries(pepeJson).reduce(
      (acc, [apeName, ape]) => ({ ...acc, [apeName]: { ...ape, set: 'dabc' } }),
      {}
    );
  } catch {
    return {};
  }
};

type PepeList = Record<string, LooneyPepe>;
type LooneyPepe = {
  burned?: number;
  img_url: string;
  order?: number;
  quantity?: number;
  series?: number;
  set?: 'dabc';
};

export const handler = schedule('@hourly', unscheduledHandler);
