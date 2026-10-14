const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

beforeAll(async () => {
  const options = new chrome.Options();
  if (process.env.HEADED !== 'true') options.addArguments('--headless=new');
  options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1920,1080');

  global.driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await global.driver.manage().setTimeouts({ implicit: 5000, pageLoad: 30000 });
}, 120000);

beforeEach(async () => {
  // Cada test comienza en la página de inicio
  await global.driver.get(BASE_URL);
  await global.driver.sleep(1000);
});

afterEach(async () => {
  try {
    await global.driver.manage().deleteAllCookies();
  } catch (e) {
    // ignore
  }
});

afterAll(async () => {
  if (global.driver) await global.driver.quit();
});
