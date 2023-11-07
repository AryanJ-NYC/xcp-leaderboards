import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getWojaks } from '../../../../lib/project-getters';

export const syncWojaks = inngest.createFunction(
  { id: 'sync-wojaks', name: 'Sync Wojaks' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getWojaks, 'wojaks');
    return new NextResponse();
  }
);
