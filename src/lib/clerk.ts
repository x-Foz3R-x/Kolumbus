import { auth } from "@clerk/nextjs/server";

export type Roles =
  | "explorer"
  | "navigator"
  | "captain"
  | "fleetCommander"
  | "tester"
  | "admin";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();

  return sessionClaims?.metadata.role === role;
};
