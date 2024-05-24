import type { PublicMetadataSchema } from "~/lib/validations/auth";

export {};

declare global {
  interface CustomJwtSessionClaims {
    public_metadata: PublicMetadataSchema;
    unsafe_metadata: object;
  }
}
