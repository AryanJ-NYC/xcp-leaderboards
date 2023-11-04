import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getRetroXcp } from '../../../../../packages/projects';

export const syncRetroXcp = inngest.createFunction(
  { id: 'sync-retro-xcp', name: 'Sync Retro XCP' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getRetroXcp, 'retro-xcp');
    return new NextResponse();
  }
);
