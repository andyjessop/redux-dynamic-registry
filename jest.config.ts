import type { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testRegex: `\/__tests__\/.*\.(test|spec)\.[jt]sx?$`,
  moduleDirectories: ["node_modules", "."],
  setupFilesAfterEnv: ["./jest.setup.ts"]
};

export default config;
