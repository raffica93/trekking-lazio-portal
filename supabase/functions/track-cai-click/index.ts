import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createTrackingHandler } from './handler.ts';

const handler = createTrackingHandler({
  measurementId: 'G-2ZZKHQPCYC',
  apiSecret: Deno.env.get('GA4_API_SECRET') ?? ''
});

Deno.serve(handler);
