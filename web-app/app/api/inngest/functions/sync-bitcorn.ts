import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getBitcornList } from '../../../../../packages/projects';

export const syncBitcorn = inngest.createFunction(
  { id: 'sync-bitcorn', name: 'Sync Bitcorn' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getBitcornList, 'bitcorn');
    return new NextResponse();
  }
);
