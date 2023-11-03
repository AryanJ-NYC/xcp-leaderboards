import type { Config } from '@netlify/functions';
import { getBitcornList } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getBitcornList, 'bitcorn');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
