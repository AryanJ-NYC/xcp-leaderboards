import sample from 'lodash/sample';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import prisma from '../../data';
import { getProject, ProjectName } from '../../packages/projects';

const Homepage: NextPage<Props> = ({ projects, setToImgurl }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {projects.map((p) => {
        const imgUrl = setToImgurl[p.slug];
        return (
          <Link href={`/projects/${p.slug}`} key={p.slug}>
            <a className="flex flex-col gap-y-8 relative rounded-b-lg shadow-2xl">
              {imgUrl && (
                <Image
                  alt={`${p.name} cover image`}
                  className="object-cover rounded-t-lg"
                  height={256}
                  width="100%"
                  src={imgUrl}
                />
              )}
              <p className="p-2 text-xl">{p.name}</p>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getAllProjects();
  const projectGetters = projects.map(async (p) => ({
    project: await getProject(p.slug as ProjectName),
    set: p.slug,
  }));

  const projectJsons = await Promise.all(projectGetters);
  const setToImgurl: Record<string, string | null> = projectJsons.reduce(
    (acc, pj) => ({ ...acc, [pj.set]: sample(pj.project)?.img_url ?? null }),
    {} as Record<string, string | null>
  );

  return { props: { projects, setToImgurl }, revalidate: 60 * 60 };
};

const getAllProjects = async () => {
  return await prisma.project.findMany();
};

type Props = {
  projects: Awaited<ReturnType<typeof getAllProjects>>;
  setToImgurl: Record<string, string | null>;
};

export default Homepage;
