import type { Config } from '@netlify/functions';
import { getDabcList } from '../../packages/projects';
import { sync } from '../sync';

const handler = async () => {
  await sync(getDabcList, 'drooling-apes');
};

export const config: Config = { schedule: '@hourly' };

export default handler;
