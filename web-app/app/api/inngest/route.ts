import { serve } from 'inngest/next';
import { inngest } from './inngest';
import * as functions from './functions';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: Object.values(functions),
});
export const runtime = 'edge';
