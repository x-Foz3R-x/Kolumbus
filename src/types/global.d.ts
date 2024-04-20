import type { UserRole } from "~/types";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
    };
  }
}
