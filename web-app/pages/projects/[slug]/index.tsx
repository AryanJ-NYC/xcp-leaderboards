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
          .map(({ addressId, assets, rank }) => (
            <Link href={`${router.asPath}/address/${addressId}`} key={addressId}>
              <a>
                <p className="text-2xl">
                  #{rank + 1} <Medal place={rank} />
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
