export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateFullName = (fullName: string) => {
  const trimmedName = fullName.trim();
  const nameParts = trimmedName.split(/\s+/);
  return nameParts.length >= 2;
};

export function validatePassword(password: string): boolean {
  const minLength = 8;

  // Regular expressions for validation
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasDigit = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    password.length < minLength ||
    !hasUppercase.test(password) ||
    !hasLowercase.test(password) ||
    !hasDigit.test(password) ||
    !hasSpecialChar.test(password)
  ) {
    return false;
  }

  return true;
}
