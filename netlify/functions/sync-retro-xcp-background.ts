import type { BackgroundHandler } from '@netlify/functions';
import { getRetroXcp } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getRetroXcp, 'retro-xcp');
};
