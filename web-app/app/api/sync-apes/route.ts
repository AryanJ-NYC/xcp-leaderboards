import { NextResponse } from 'next/server';
import { getDabcList } from '../../../lib/project-getters';
import { sync } from '../inngest/sync';

export const POST = async () => {
  await sync(getDabcList, 'drooling-apes');
  return new NextResponse();
};

export const unstable_allowDynamic = [
  // use a glob to allow anything in the function-bind 3rd party module
  '/node_modules/counterparty-node-client/**',
];
export const runtime = 'edge';
