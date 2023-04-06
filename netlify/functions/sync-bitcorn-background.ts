import type { BackgroundHandler } from '@netlify/functions';
import { getBitcornList } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getBitcornList, 'bitcorn');
};
