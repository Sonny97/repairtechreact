module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.js'],
  testTimeout: 60000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'RepairTech - Reporte E2E',
      outputPath: '<rootDir>/reports/report.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
    }],
    ['jest-junit', { outputDirectory: '<rootDir>/reports', outputName: 'junit.xml' }],
  ],
};
