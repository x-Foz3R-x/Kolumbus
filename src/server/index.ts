import { router } from "./trpc";
import trip from "./routers/trip";
import event from "./routers/event";

// Main router where you can add new routers.
export const appRouter = router({
  trip,
  event,
});

export type AppRouter = typeof appRouter;
