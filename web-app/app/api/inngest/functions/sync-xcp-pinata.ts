import { getXcpPinata } from '../../../../../packages/projects';
import { inngest } from '../inngest';
import { sync } from '../sync';

export const syncXcpPinata = inngest.createFunction(
  { id: 'sync-xcp-pinata', name: 'Sync XCP Pinata' },
  { cron: '0 * * * *' }, //hourly
  async () => {
    await sync(getXcpPinata, 'xcp-pinata');
  }
);
