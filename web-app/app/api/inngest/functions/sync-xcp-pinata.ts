import { NextResponse } from 'next/server';
import { inngest } from '../inngest';
import { sync } from '../sync';
import { getXcpPinata } from '../../../../lib/project-getters';

export const syncXcpPinata = inngest.createFunction(
  { id: 'sync-xcp-pinata', name: 'Sync XCP Pinata' },
  { cron: '0 * * * *' }, // hourly
  async () => {
    await sync(getXcpPinata, 'xcp-pinata');
    return new NextResponse();
  }
);
