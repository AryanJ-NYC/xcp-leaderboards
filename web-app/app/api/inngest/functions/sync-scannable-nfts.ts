import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getScannableNfts } from '../../../../../packages/projects';

export const syncScannables = inngest.createFunction(
  { id: 'sync-scannables', name: 'Sync Scannable NFTs' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getScannableNfts, 'scannable-nfts');
    return new NextResponse();
  }
);
