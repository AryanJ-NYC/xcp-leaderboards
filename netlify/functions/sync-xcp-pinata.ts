import { Handler, schedule } from '@netlify/functions';
import { getXcpPinata } from '../../packages/projects';
import { sync } from '../sync';

const unscheduledHandler: Handler = async function () {
  await sync(getXcpPinata, 'xcp-pinata');
  return { statusCode: 200 };
};

export const handler = schedule('0 */8 * * *', unscheduledHandler);
