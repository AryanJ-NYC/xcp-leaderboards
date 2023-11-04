import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getPhunchkins } from '../../../../../packages/projects';

export const syncPhunchkins = inngest.createFunction(
  { id: 'sync-phunchkins', name: 'Sync Phunchkins' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getPhunchkins, 'phunchkins');
    return new NextResponse();
  }
);
