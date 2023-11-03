import type { Config } from '@netlify/functions';
import { getPhunchkins } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getPhunchkins, 'phunchkins');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
