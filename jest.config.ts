/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Your path mappings here
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    "**/__tests__/**/*.test.ts",
  ],
};

module.exports = config; 