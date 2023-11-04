import sample from 'lodash/sample';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import prisma from '../../data';
import { getProjectAssets, ProjectName } from '../../packages/projects';

const Homepage: NextPage<Props> = ({ projects, setToImgurl }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {projects.map((p) => {
        const imgUrl = setToImgurl[p.slug];
        return (
          <Link
            className="flex flex-col gap-y-8 rounded-b-lg shadow-2xl"
            href={`/projects/${p.slug}`}
            key={p.slug}
          >
            {imgUrl && imgUrl.includes('mp4') ? (
              <video autoPlay height="100%" key={p.name} src={imgUrl} width="100%" />
            ) : (
              <div className="h-64 relative">
                <Image
                  alt="Asset"
                  className="object-cover rounded-t-lg"
                  fill
                  key={p.name}
                  quality={25}
                  src={imgUrl!}
                />
              </div>
            )}
            <p className="p-2 text-xl">{p.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getAllProjects();
  const projectGetters = projects
    .filter((p) => p.slug !== 'stamps')
    .map(async (p) => ({
      project: await getProjectAssets(p.slug as ProjectName),
      set: p.slug,
    }));

  const projectJsons = await Promise.all(projectGetters);
  const setToImgurl: Record<string, string | null> = projectJsons.reduce(
    (acc, pj) => ({ ...acc, [pj.set]: sample(pj.project)?.img_url ?? null }),
    {} as Record<string, string | null>
  );

  return {
    props: {
      projects,
      setToImgurl: {
        ...setToImgurl,
        stamps:
          'https://stampchain.io/stamps/17686488353b65b128d19031240478ba50f1387d0ea7e5f188ea7fda78ea06f4.png',
      },
    },
    revalidate: 60 * 60,
  };
};

const getAllProjects = async () => {
  return await prisma.project.findMany({ select: { name: true, slug: true } });
};

type Props = {
  projects: Awaited<ReturnType<typeof getAllProjects>>;
  setToImgurl: Record<string, string | null>;
};

export default Homepage;
