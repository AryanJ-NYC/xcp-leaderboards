import { PrismaClient } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

const Homepage: NextPage<Props> = ({ projects }) => {
  return (
    <div className="flex flex-col space-y-4">
      {projects.map((p) => (
        <Link href={`/projects/${p.slug}`} key={p.slug}>
          {p.name}
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getAllProjects();
  return { props: { projects } };
};

const prisma = new PrismaClient();
const getAllProjects = async () => {
  return await prisma.project.findMany();
};

type Props = {
  projects: Awaited<ReturnType<typeof getAllProjects>>;
};

export default Homepage;
