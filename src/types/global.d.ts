import type { UserRoles } from "~/types";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRoles;
    };
  }
}
