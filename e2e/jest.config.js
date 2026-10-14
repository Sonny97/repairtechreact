module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/e2e/tests/**/*.spec.js'],
  timeout: 60000,
  reporter: ['text', 'html', 'allure'],
  reporters: [
    'default',
    ['jest-html-reporter', { outputPath: './e2e/reports/report.html' }]
  ],
  allureResultsPath: './e2e/reports/allure-results',
  allureReportPath: './e2e/reports/allure-report',
  setupFilesAfterEnv: ['./e2e/jest.setup.js'],
  browser: process.env.BROWSER || 'chrome',
  baseUrl: process.env.BASE_URL || 'http://localhost:3002',
};
