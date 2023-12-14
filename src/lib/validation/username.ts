import isBlacklisted from "./username-blacklist";

export function ValidateUsername(username: string) {
  return {
    length: username.length >= 5 && username.length <= 32,
    characters: /^[-_]{0,3}[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*[-_]{0,3}$/.test(username),
    allowed: !isBlacklisted(username.toLowerCase()),
  };
}
