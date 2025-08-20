/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'],
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: 'tsconfig.json' }
    ]
  },
  coveragePathIgnorePatterns: [
    "node_modules",
    "<rootDir>/test/"
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts"
  ],
  coverageReporters: ["text", "lcov"],
  coverageProvider: "v8"
};