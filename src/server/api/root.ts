import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { tripRouter } from "~/server/api/routers/trip";
import { membershipRouter } from "./routers/membership";
import { externalRouter } from "./routers/external";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  trip: tripRouter,
  membership: membershipRouter,
  event: eventRouter,
  external: externalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
