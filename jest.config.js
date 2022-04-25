module.exports = {
  // TODO: Publish shared / standard presets?
  // preset: 'pkg-name',

  // TODO: Custom reporters?
  // reporters: [
  //   'default',
  //   '<rootDir>/something.js',
  //   ['<rootDir>/something-else.js', {option: 'value'}]
  // ],

  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // TODO: Enforce expected coverage thresholds
  // coverageThreshold: {
  //   global: {
  //     lines: 80,
  //     branches: 80,
  //     functions: 80,
  //     statements: -10
  //   }
  // },

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  // coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov']
};
