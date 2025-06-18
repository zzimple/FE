import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 기존 next 설정
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👇 여기에 규칙 비활성화 추가
  {
    rules: {
      'no-unused-vars': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // 필요한 규칙 더 추가 가능
    },
  },
];

export default eslintConfig;
