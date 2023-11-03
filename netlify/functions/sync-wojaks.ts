import type { Config } from '@netlify/functions';
import { getWojaks } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getWojaks, 'wojaks');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
