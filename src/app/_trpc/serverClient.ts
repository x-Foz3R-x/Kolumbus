import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server";

const url = process.env.NODE_ENV === "production" ? "https://kolumbus.app/api/trpc" : "http://localhost:3000/api/trpc";

export const serverApi = appRouter.createCaller({
  links: [httpBatchLink({ url })],
});
