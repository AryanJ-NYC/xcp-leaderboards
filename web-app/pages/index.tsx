import { PrismaClient } from '@prisma/client';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { FcSearch } from 'react-icons/fc';

const Home: NextPage<Props> = ({ addresses, totalAssetCount }) => {
  const [searchedAddy, setChangeAddy] = useState('');

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-4xl">Droooling Apes Leaderboard</h1>
        <p>Click address for more detailed address info.</p>
      </div>

      <label className="border relative rounded w-96">
        <input
          className="h-full w-full p-2"
          onChange={(e) => setChangeAddy(e.target.value.trim())}
          type="text"
        />
        <FcSearch className="absolute right-4 top-0 bottom-0 my-auto" />
      </label>
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
                <p className="text-2xl">
                  #{i} <Medal place={i} />
                </p>
                <p>{addressId}</p>
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

const Medal: React.FC<{ place: number }> = ({ place }) => {
  if (place > 2) return null;
  if (place === 0) return <>🥇</>;
  if (place === 1) return <>🥈</>;
  if (place === 2) return <>🥉</>;
  return null;
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
