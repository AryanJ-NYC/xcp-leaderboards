import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getDabcList } from '../../../../../packages/projects';

export const syncApes = inngest.createFunction(
  { id: 'sync-apes', name: 'Sync Drooling Apes' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getDabcList, 'drooling-apes');
    return new NextResponse();
  }
);
