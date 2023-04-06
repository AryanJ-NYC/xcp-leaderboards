import type { BackgroundHandler } from '@netlify/functions';
import { getDabcList } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getDabcList, 'drooling-apes');
};
