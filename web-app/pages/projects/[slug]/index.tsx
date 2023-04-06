import clsx from 'clsx';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { BsTelegram, BsTwitter } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import { TfiWorld } from 'react-icons/tfi';
import { VscJson } from 'react-icons/vsc';
import prisma from '../../../../data';

const Home: NextPage<Props> = ({ addresses, project }) => {
  const router = useRouter();
  const [searchedAddy, setChangeAddy] = useState('');
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-4xl">{project.name}</h1>
        <div className="flex gap-x-4 text-xl">
          <a
            className="text-blue-500 hover:text-blue-600"
            href={project.telegramUrl}
            rel="noreferrer"
            target="_blank"
          >
            <BsTelegram />
          </a>
          <a
            className="text-blue-500 hover:text-blue-600"
            href={project.websiteUrl}
            rel="noreferrer"
            target="_blank"
          >
            <TfiWorld />
          </a>
          {project.twitterUrl ? (
            <a
              className="text-blue-500 hover:text-blue-600"
              href={project.twitterUrl}
              rel="noreferrer"
              target="_blank"
            >
              <BsTwitter />
            </a>
          ) : null}
          <a
            className="text-blue-500 hover:text-blue-600"
            href={project.feedUrl}
            rel="noreferrer"
            target="_blank"
          >
            <VscJson />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <p>Click address for more detailed address info.</p>
        <div className="border relative rounded w-full lg:w-96">
          <label>
            <input
              className="h-full w-full p-2"
              onChange={(e) => setChangeAddy(e.target.value.trim())}
              type="text"
            />
            <FcSearch className="absolute right-4 top-0 bottom-0 my-auto" />
          </label>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {addresses
            .filter(({ addressId }) => {
              if (searchedAddy) {
                return addressId.toLowerCase().includes(searchedAddy.toLowerCase());
              }
              return true;
            })
            .map(({ addressId, assets, rank }) => (
              <Link href={`${router.asPath}/address/${addressId}`} key={addressId}>
                <a
                  className={clsx(
                    'flex py-4 rounded-lg',
                    rank === 0 && 'shadow-yellow-400 shadow-2xl',
                    rank === 1 && 'shadow-slate-500 shadow-2xl',
                    rank === 2 && 'shadow-orange-700 shadow-2xl',
                    rank > 2 && 'shadow-lg'
                  )}
                >
                  <div className="border-r flex items-center px-4 sm:px-8">
                    {rank < 3 ? <Medal place={rank} /> : <p className="text-2xl">#{rank + 1}</p>}
                  </div>
                  <div className="px-4 sm:px-8 overflow-x-hidden">
                    <p className="truncate font-medium tracking-wider">{addressId}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {assets.length} / {project.assetCount} unique assets collected
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {assets.reduce((acc, asset) => asset.quantity + acc, 0).toLocaleString()}{' '}
                      total assets collected
                    </p>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

const Medal: React.FC<{ place: number }> = ({ place }) => {
  if (place > 2) return null;
  if (place === 0) return <p className="text-3xl">🥇</p>;
  if (place === 1) return <p className="text-3xl">🥈</p>;
  if (place === 2) return <p className="text-3xl">🥉</p>;
  return null;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { fallback: true, paths: [] };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (typeof params?.slug !== 'string') {
    return { notFound: true };
  }
  const [addresses, project] = await Promise.all([
    getAddresses(params.slug),
    getProject(params.slug),
  ]);
  if (!project) {
    return { notFound: true };
  }

  await fetch(
    `https://xcp-leaderboards.netlify.app/.netlify/functions/sync-${params.slug}-background`,
    { method: 'POST' }
  );

  return {
    props: { addresses, project },
    revalidate: 60 * 60, // 1 hour
  };
};

const getAddresses = async (projectSlug: string) => {
  const addresses = await prisma.addressProjectDetails.findMany({
    orderBy: { rank: 'asc' },
    select: { addressId: true, assets: true, rank: true },
    where: { projectSlug },
  });
  return addresses as {
    addressId: string;
    assets: { assetName: string; quantity: number }[];
    rank: number;
  }[];
};

const getProject = async (projectSlug: string) => {
  return prisma.project.findUnique({
    select: {
      assetCount: true,
      feedUrl: true,
      name: true,
      telegramUrl: true,
      twitterUrl: true,
      websiteUrl: true,
    },
    where: { slug: projectSlug },
  });
};

type Props = {
  addresses: Awaited<ReturnType<typeof getAddresses>>;
  project: NonNullable<Awaited<ReturnType<typeof getProject>>>;
};

export default Home;
