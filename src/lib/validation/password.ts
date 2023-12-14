export function ValidatePassword(password: string) {
  return {
    length: password.length >= 8 && password.length <= 72,
    lowerCase: /[a-z]/.test(password),
    upperCase: /[A-Z]/.test(password),
    numberOrSymbol: /[0-9!@#$%^&*+_-]/.test(password),
  };
}

// TODO: Implement password scoring.
function passwordScore(password: string) {}
