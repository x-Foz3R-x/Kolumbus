import isBlacklisted from "./username-blacklist";

const regex = /^[-_]{0,3}[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*[-_]{0,3}$/;

/**
 * Validates a username.
 *
 * @param username - The username to validate.
 * @returns An array of boolean values indicating the presence of the following criteria:
 * - 0. Length of the username.
 * - 1. Absence of invalid characters in the username.
 * - 2. Absence of blacklisted words in the username.
 */
export function validateUsername(username: string): [boolean, boolean, boolean] {
  return [username.length >= 5 && username.length <= 32, regex.test(username), !isBlacklisted(username.toLowerCase())];
}
