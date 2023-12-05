/**
 * Validates a password and returns an array of boolean values indicating the presence of certain criteria.
 *
 * @param password - The password to be validated.
 * @returns An array of boolean values indicating the presence of the following criteria:
 * - 0. Length of the password.
 * - 1. Presence of lowercase letters in the password.
 * - 2. Presence of uppercase letters in the password.
 * - 3. Presence of numbers or symbols in the password.
 */
export function validatePassword(password: string): [boolean, boolean, boolean, boolean] {
  return [Check.length(password), Check.lowerCase(password), Check.upperCase(password), Check.numberOrSymbol(password)];
}

// TODO: Implement password scoring.
function passwordScore(password: string) {}

const Check = {
  length: (password: string): boolean => password.length >= 8,
  lowerCase: (password: string): boolean => /[a-z]/.test(password),
  upperCase: (password: string): boolean => /[A-Z]/.test(password),
  numberOrSymbol: (password: string): boolean => /[0-9!@#$%^&*+_-]/.test(password),
};
