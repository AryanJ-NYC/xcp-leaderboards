import { getBitcornList } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncBitcorn = inngest.createFunction(
  { id: 'sync-bitcorn' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getBitcornList, 'bitcorn');
  }
);
