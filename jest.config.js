/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['./src/**/*.ts'],
  coveragePathIgnorePatterns: ['node_modules', 'dist'],
};