import { createRouteHandler } from "uploadthing/next";

import { KolumbusFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: KolumbusFileRouter,
});
