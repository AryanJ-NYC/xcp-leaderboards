import { NextResponse } from 'next/server';
import { getDabcList } from '../../../lib/project-getters';
import { sync } from '../inngest/sync';

export const POST = async () => {
  await sync(getDabcList, 'drooling-apes');
  return new NextResponse();
};
export const runtime = 'edge';
