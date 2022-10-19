import { Handler, schedule } from '@netlify/functions';
import { getPhunchkins } from '../../packages/projects';
import { sync } from '../sync';

const unscheduledHandler: Handler = async function () {
  await sync(getPhunchkins, 'phunchkins');
  return { statusCode: 200 };
};

export const handler = schedule('0 */8 * * *', unscheduledHandler);
