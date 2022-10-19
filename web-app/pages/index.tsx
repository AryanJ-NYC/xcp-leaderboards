import { PrismaClient } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';

const Home: NextPage<Props> = ({ addresses, totalAssetCount }) => {
  const [searchedAddy, setChangeAddy] = useState('');

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="text-4xl">Droooling Apes Leaderboard</h1>
      <input
        className="border rounded p-2 w-96"
        onChange={(e) => setChangeAddy(e.target.value.trim())}
        type="text"
      />
      <div className="flex flex-col gap-y-12">
        {addresses
          .filter(({ addressId }) => {
            if (searchedAddy) {
              return addressId.toLowerCase().includes(searchedAddy.toLowerCase());
            }
            return true;
          })
          .map(({ addressId, assets }, i) => (
            <Link href={`/address/${addressId}`} key={addressId}>
              <a>
                <p>
                  #{i} {addressId}
                </p>
                <p>
                  {assets.length} / {totalAssetCount} collected
                </p>
                <p>
                  {assets.reduce((acc, asset) => asset.quantity + acc, 0).toLocaleString()} total
                  assets collected.
                </p>
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [addresses, pepesResponse] = await Promise.all([
    getAddresses(),
    fetch('https://droolingapebus.club/api/verbose-feed'),
  ]);
  const pepeJson: Record<string, { img_url: string }> = await pepesResponse.json();

  return { props: { addresses, totalAssetCount: Object.keys(pepeJson).length } };
};

const getAddresses = async () => {
  const prisma = new PrismaClient();
  const addresses = await prisma.addressAssets.findMany({
    orderBy: { rank: 'asc' },
    select: { addressId: true, assets: true },
    where: { projectId: 'ed7e7655-6695-4420-bc30-a60823fa0153' },
  });
  return addresses as {
    addressId: string;
    assets: { assetName: string; quantity: number }[];
  }[];
};

type Props = {
  addresses: Awaited<ReturnType<typeof getAddresses>>;
  totalAssetCount: number;
};

export default Home;
