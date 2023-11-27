import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server";
import { BASE_URL } from "@/lib/config";

export const serverApi = appRouter.createCaller({
  links: [httpBatchLink({ url: `${BASE_URL}/api/trpc` })],
});
