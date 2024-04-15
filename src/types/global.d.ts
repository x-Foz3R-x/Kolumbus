import type { Roles } from "~/lib/clerk";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
