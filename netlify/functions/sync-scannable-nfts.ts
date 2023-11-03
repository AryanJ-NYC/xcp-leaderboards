import type { Config } from '@netlify/functions';
import { getScannableNfts } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getScannableNfts, 'scannable-nfts');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
