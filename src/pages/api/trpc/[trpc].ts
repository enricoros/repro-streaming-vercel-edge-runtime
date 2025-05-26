/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { publicProcedure, router } from '~/server/trpc';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

let srvRunCount = 0;

const appRouter = router({

  // [REPRO] Adding Async Generator's example - https://trpc.io/docs/client/links/httpBatchStreamLink
  iterable: publicProcedure.query(async function* () {
    yield { t: '_run' as const, c: ++srvRunCount };
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      yield { t: '_tick' as const, i };
    }
  }),

  greeting: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z.object({
        name: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      // This is what you're returning to your client
      return {
        text: `hello ${input?.name ?? 'world'}`,
        // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
      };
    }),
  // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  // getUser: t.procedure.query(() => {
  //   return { id: '1', name: 'bob' };
  // }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// We're using the edge-runtime
export const config = {
  runtime: 'edge',
};

// export API handler
export default async function handler(req: NextRequest) {
  console.error('Request:', req);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: () => ({}),
  });
}
