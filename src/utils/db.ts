import { customAlphabet } from "nanoid";

// Member permissions as template
export enum MemberPermissionsTemplate {
  // General permissions
  shareInvite = 1 << 0,
  createInvite = 1 << 1,
  kickMembers = 1 << 2,
  managePermissions = 1 << 3,

  // Trip permissions
  editTrip = 1 << 4,
  addEvents = 1 << 5,
  editEvents = 1 << 6,
  deleteEvents = 1 << 7,
  editOwnEvents = 1 << 8,
  deleteOwnEvents = 1 << 9,
}

/**
 * Generates a random ID string.
 * @param length The length of the ID string. Defaults to 16.
 * @returns A random ID string.
 */
export function createId(length = 16) {
  return customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length)();
}

/**
 * Encodes permissions based on a given permissions object and permissions template.
 * @param permissions - The permissions object or boolean value.
 * @param permissionsTemplate - The permissions template (enum).
 * @returns The encoded permissions as a number.
 */
export function encodePermissions(
  permissions: Record<string, boolean> | boolean,
  permissionsTemplate: unknown,
): number {
  const pEnum = permissionsTemplate as Record<string, number>;

  if (typeof permissions === "boolean") return permissions ? -1 : 0;
  return Object.entries(permissions).reduce(
    (encoded, [key, value]) => (value ? encoded | pEnum[key]! : encoded),
    0,
  );
}

/**
 * Decodes the encoded permissions using the provided permissions template.
 * @param encoded - The encoded permissions value.
 * @param permissionsTemplate - The permissions template (enum).
 * @returns An object representing the decoded permissions.
 */
export function decodePermissions<T extends Record<string, boolean>>(
  encoded: number,
  permissionsTemplate: unknown,
): T {
  const pEnum = permissionsTemplate as Record<string, number>;
  const permissions: Partial<Record<string, boolean>> = {};

  Object.keys(pEnum).forEach((key) => {
    if (isNaN(Number(key))) permissions[key] = (encoded & pEnum[key]!) !== 0;
  });

  return permissions as T;
}
