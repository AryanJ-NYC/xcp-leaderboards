import { Handler, schedule } from '@netlify/functions';
import { getScannableNfts } from '../../packages/projects';
import { sync } from '../sync';

const unscheduledHandler: Handler = async function () {
  await sync(getScannableNfts, 'scannable-nfts');
  return { statusCode: 200 };
};

export const handler = schedule('0 */8 * * *', unscheduledHandler);
