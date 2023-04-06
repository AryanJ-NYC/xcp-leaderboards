import type { BackgroundHandler } from '@netlify/functions';
import { getStamps } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getStamps, 'stamps');
};
