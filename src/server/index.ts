import { router } from "./trpc";

import clerk from "./routers/clerk";
import google from "./routers/google";
import trips from "./routers/trips";
import tripOld from "./routers/trip copy";
import memberships from "./routers/memberships";
import event from "./routers/event";

// Main router where you can add new routers.
export const appRouter = router({
  clerk,
  google,
  memberships,
  trips,
  tripOld,
  event,
});

export type AppRouter = typeof appRouter;
