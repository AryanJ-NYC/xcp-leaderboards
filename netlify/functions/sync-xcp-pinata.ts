import type { Config } from '@netlify/functions';
import { getXcpPinata } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getXcpPinata, 'xcp-pinata');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
