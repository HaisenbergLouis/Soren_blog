export type PasswordStrength = "weak" | "medium" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  label: string;
  color: string;
  barColor: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

const MIN_LENGTH = 8;

export function checkPasswordStrength(
  password: string,
): PasswordStrengthResult {
  const requirements = {
    minLength: password.length >= MIN_LENGTH,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
  };

  const passed = Object.values(requirements).filter(Boolean).length;

  // score: 0-100
  let score = 0;
  // Length contributes up to 40 points
  score += Math.min(password.length * 4, 40);
  // Each met requirement adds 12 points
  score += passed * 12;
  // Bonus for mixing types
  if (requirements.hasUpperCase && requirements.hasLowerCase) score += 5;
  if (
    requirements.hasNumber &&
    (requirements.hasUpperCase || requirements.hasLowerCase)
  )
    score += 5;
  if (requirements.hasSpecialChar) score += 10;

  score = Math.min(score, 100);

  let strength: PasswordStrength;
  let label: string;
  let color: string;
  let barColor: string;

  if (score < 40 || password.length < MIN_LENGTH) {
    strength = "weak";
    label = "弱";
    color = "text-red-500";
    barColor = "bg-red-500";
  } else if (score < 70) {
    strength = "medium";
    label = "中";
    color = "text-yellow-500";
    barColor = "bg-yellow-500";
  } else {
    strength = "strong";
    label = "强";
    color = "text-green-500";
    barColor = "bg-green-500";
  }

  return { strength, score, label, color, barColor, requirements };
}

export function getPasswordErrors(
  password: string,
  result?: PasswordStrengthResult,
): string[] {
  const errors: string[] = [];
  const req =
    result?.requirements ?? checkPasswordStrength(password).requirements;

  if (!req.minLength) errors.push(`至少 ${MIN_LENGTH} 个字符`);
  if (!req.hasUpperCase) errors.push("至少一个大写字母");
  if (!req.hasLowerCase) errors.push("至少一个小写字母");
  if (!req.hasNumber) errors.push("至少一个数字");
  if (!req.hasSpecialChar) errors.push("至少一个特殊字符 (!@#$%^&*等)");

  return errors;
}
