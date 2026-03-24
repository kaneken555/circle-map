const MIN_RADIUS = 0.1;
const MAX_RADIUS = 50;
const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

type ValidationResult = {
  error: string;
  validValue: number | null;
};

export function validateRadius(input: string): ValidationResult {
  if (input === "") {
    return { error: "距離を入力してください", validValue: null };
  }

  if (isNaN(Number(input)) || !DECIMAL_PATTERN.test(input)) {
    return { error: "数値を入力してください", validValue: null };
  }

  const num = parseFloat(input);

  if (num < MIN_RADIUS) {
    return { error: `距離は ${MIN_RADIUS} km 以上で入力してください`, validValue: null };
  }

  if (num > MAX_RADIUS) {
    return { error: `距離は ${MAX_RADIUS} km 以下で入力してください`, validValue: null };
  }

  return { error: "", validValue: num };
}
