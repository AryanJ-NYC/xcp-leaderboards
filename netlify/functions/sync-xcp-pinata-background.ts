import type { BackgroundHandler } from '@netlify/functions';
import { getXcpPinata } from '../../packages/projects';
import { sync } from '../sync';

export const handler: BackgroundHandler = async () => {
  await sync(getXcpPinata, 'xcp-pinata');
};
