import type { BackgroundHandler } from '@netlify/functions';
import { getPhunchkins } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getPhunchkins, 'phunchkins');
};
