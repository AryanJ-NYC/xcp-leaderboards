import type { BackgroundHandler } from '@netlify/functions';
import { getScannableNfts } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getScannableNfts, 'scannable-nfts');
};
