import { getPhunchkins } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncPhunchkins = inngest.createFunction(
  { id: 'sync-phunchkins' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getPhunchkins, 'phunchkins');
  }
);
