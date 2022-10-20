import clsx from 'clsx';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FcSearch } from 'react-icons/fc';
import prisma from '../../../../data';
import { getProject, ProjectName } from '../../../../packages/projects';

const Home: NextPage<Props> = ({ addresses, projectName, totalAssetCount }) => {
  const router = useRouter();
  const [searchedAddy, setChangeAddy] = useState('');
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-4xl">{projectName} Leaderboard</h1>
        <p>Click address for more detailed address info.</p>
      </div>

      <label className="border relative rounded w-full lg:w-96">
        <input
          className="h-full w-full p-2"
          onChange={(e) => setChangeAddy(e.target.value.trim())}
          type="text"
        />
        <FcSearch className="absolute right-4 top-0 bottom-0 my-auto" />
      </label>
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
                    {assets.length} / {totalAssetCount} unique assets collected
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {assets.reduce((acc, asset) => asset.quantity + acc, 0).toLocaleString()} total
                    assets collected
                  </p>
                </div>
              </a>
            </Link>
          ))}
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
  const [addresses, pepes, project] = await Promise.all([
    getAddresses(params.slug),
    getProject(params.slug as ProjectName),
    prisma.project.findUnique({ select: { name: true }, where: { slug: params.slug } }),
  ]);
  if (!project) {
    return { notFound: true };
  }

  return {
    props: { addresses, projectName: project.name, totalAssetCount: Object.keys(pepes).length },
    revalidate: 60 * 30,
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

type Props = {
  addresses: Awaited<ReturnType<typeof getAddresses>>;
  projectName: string;
  totalAssetCount: number;
};

export default Home;
