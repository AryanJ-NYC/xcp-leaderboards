import { getDabcList } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncApes = inngest.createFunction(
  { id: 'sync-apes', name: 'Sync Drooling Apes' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getDabcList, 'drooling-apes');
  }
);
