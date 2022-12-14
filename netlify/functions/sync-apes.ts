import { Handler, schedule } from '@netlify/functions';
import { getDabcList } from '../../packages/projects';
import { sync } from '../sync';

const unscheduledHandler: Handler = async function () {
  await sync(getDabcList, 'drooling-apes');
  return { statusCode: 200 };
};

export const handler = schedule('0 */8 * * *', unscheduledHandler);
