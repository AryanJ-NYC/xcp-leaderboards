import type { BackgroundHandler } from '@netlify/functions';
import { getWojaks } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getWojaks, 'wojaks');
};
