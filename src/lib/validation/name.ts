import isBlacklisted from "./name-blacklist";

export function ValidateName(username: string) {
  const [first, last] = username.split(" ");

  return {
    length: username.length >= 3 && username.length <= 32,
    // characters: /^[-_]{0,1}[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*[-_]{0,1}(\s[-_]{0,1}[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*[-_]{0,1})?$/.test(username),
    // characters: /^[-_]{0,1}[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*[-_]{0,1}$/.test(username), -> not supporting spaces
    characters: ValidateUsernameCharacters(first) && ValidateUsernameCharacters(last),
    allowed: !isBlacklisted(username.toLowerCase()),
  };
}

function ValidateUsernameCharacters(username: string) {
  return /^[-_]{0,1}[\p{L}0-9]+([-_][\p{L}0-9]+)*[-_]{0,1}$/u.test(username);
}
