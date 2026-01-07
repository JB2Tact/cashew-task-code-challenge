import nextPlugin from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "e2e/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...nextPlugin,
];

export default eslintConfig;
