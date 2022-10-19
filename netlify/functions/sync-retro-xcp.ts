import { Handler, schedule } from '@netlify/functions';
import { getRetroXcp } from '../../packages/projects';
import { sync } from '../sync';

const unscheduledHandler: Handler = async function () {
  await sync(getRetroXcp, 'retro-xcp');
  return { statusCode: 200 };
};

export const handler = schedule('0 */8 * * *', unscheduledHandler);
