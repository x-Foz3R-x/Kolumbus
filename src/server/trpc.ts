import { TRPCError, initTRPC } from "@trpc/server";
import { currentUser } from "@clerk/nextjs/server";

const t = initTRPC.create();

const isAuthed = t.middleware(async ({ next }) => {
  const user = await currentUser();

  if (!user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      user: user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
