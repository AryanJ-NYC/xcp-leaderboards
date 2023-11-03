import type { Config } from '@netlify/functions';
import { getRetroXcp } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getRetroXcp, 'retro-xcp');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
