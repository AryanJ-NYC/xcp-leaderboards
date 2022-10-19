import { PrismaClient } from '@prisma/client';
import clsx from 'clsx';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { getProject, ProjectName } from '@projects';
import Link from 'next/link';

const Home: NextPage<Props> = ({ address, assetToImgUrl }) => {
  const router = useRouter();
  if (router.isFallback) return <p>Loading...</p>;

  const totalAssetCount = Object.keys(assetToImgUrl).length;
  const assets = address?.assets;
  const rank = typeof address.rank === 'number' ? address.rank + 1 : -1;

  return (
    <div>
      <Link href={`/projects/${router.query.slug}`}>&laquo; Back to Leaderboard</Link>
      <h1>
        #{rank} {address.address}
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
                <video height={pictureSize} key={assetName} src={img_url} width={pictureSize} />
              ) : (
                <Image
                  alt="Asset"
                  className="object-contain"
                  height={pictureSize}
                  key={assetName}
                  quality={25}
                  src={img_url}
                  width={pictureSize}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
};

const pictureSize = 64;
export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (typeof params?.address !== 'string' || typeof params?.slug !== 'string') {
    return { notFound: true };
  }
  const [address, pepes] = await Promise.all([
    getAddress(params.address, params.slug),
    getProject(params.slug as ProjectName),
  ]);
  if (!address) {
    return { notFound: true };
  }

  return { props: { address, assetToImgUrl: pepes }, revalidate: 60 * 30 };
};

const getAddress = async (address: string, projectSlug: string) => {
  const prisma = new PrismaClient();
  const _address = await prisma.address.findUnique({
    select: {
      address: true,
      details: {
        select: { assets: true, rank: true },
        where: { projectSlug },
      },
    },
    where: { address },
  });

  return {
    address,
    assets: _address?.details[0].assets as { assetName: string; quantity: number }[],
    rank: _address?.details[0].rank,
  };
};

type Props = {
  assetToImgUrl: Record<string, { img_url: string }>;
  address: Awaited<ReturnType<typeof getAddress>>;
};

export default Home;
