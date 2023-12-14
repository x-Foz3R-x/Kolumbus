import { router } from "./trpc";
import trip from "./routers/trip";
import event from "./routers/event";
import google from "./routers/google";
import clerk from "./routers/clerk";

// Main router where you can add new routers.
export const appRouter = router({
  trip,
  event,
  google,
  clerk,
});

export type AppRouter = typeof appRouter;
