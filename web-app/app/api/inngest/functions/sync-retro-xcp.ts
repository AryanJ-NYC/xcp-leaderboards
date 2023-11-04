import { getRetroXcp } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncRetroXcp = inngest.createFunction(
  { id: 'sync-retro-xcp', name: 'Sync Retro XCP' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getRetroXcp, 'retro-xcp');
  }
);
