import { getScannableNfts } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncScannables = inngest.createFunction(
  { id: 'sync-scannables' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getScannableNfts, 'scannable-nfts');
  }
);
