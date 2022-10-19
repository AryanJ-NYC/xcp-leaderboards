import { PrismaClient } from '@prisma/client';
import clsx from 'clsx';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

const Home: NextPage<Props> = ({ address, assetToImgUrl }) => {
  const router = useRouter();
  if (router.isFallback) return <p>Loading...</p>;

  const totalAssetCount = Object.keys(assetToImgUrl).length;
  const assets = address?.assets;

  return (
    <div>
      <h1>
        #{address.rank} {address.address}
      </h1>
      <p>
        {assets.length} / {totalAssetCount} Collected
      </p>
      <div className="gap-y-2 gap-x-2 grid grid-cols-12 w-fit">
        {Object.entries(assetToImgUrl).map(([assetName, { img_url }]) => {
          const isMissing = !assets.some((a) => a.assetName === assetName);
          return (
            <a
              className={clsx('hover:opacity-100', isMissing && 'opacity-30')}
              href={`https://scarce.city/marketplace/digital/${assetName}`}
              key={assetName}
              rel="noreferrer"
              target="_blank"
            >
              {img_url.includes('mp4') ? (
                <video height={32} key={assetName} src={img_url} width={32} />
              ) : (
                <Image
                  alt="Asset"
                  height={32}
                  key={assetName}
                  quality={25}
                  src={img_url}
                  width={32}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (typeof params?.address !== 'string') {
    return { notFound: true };
  }
  const [address, pepesResponse] = await Promise.all([
    getAddress(params.address),
    fetch('https://droolingapebus.club/api/verbose-feed'),
  ]);
  if (!address) {
    return { notFound: true };
  }

  const pepeJson: Record<string, { img_url: string }> = await pepesResponse.json();
  return { props: { address, assetToImgUrl: pepeJson } };
};

const getAddress = async (address: string) => {
  const prisma = new PrismaClient();
  const _address = await prisma.address.findUnique({
    select: {
      address: true,
      assets: {
        select: { assets: true, rank: true },
        where: { projectId: 'ed7e7655-6695-4420-bc30-a60823fa0153' },
      },
    },
    where: { address },
  });
  return {
    address,
    assets: _address?.assets[0].assets as { assetName: string; quantity: number }[],
    rank: _address?.assets[0].rank,
  };
};

type Props = {
  assetToImgUrl: Record<string, { img_url: string }>;
  address: Awaited<ReturnType<typeof getAddress>>;
};

export default Home;
