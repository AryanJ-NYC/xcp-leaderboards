import { getWojaks } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncWojaks = inngest.createFunction(
  { id: 'sync-wojaks', name: 'Sync Wojaks' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getWojaks, 'wojaks');
  }
);
