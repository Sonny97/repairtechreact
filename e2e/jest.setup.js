const { After, AfterAll, Before, BeforeAll, setDefaultTimeout } = require('@jest/globals');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

setDefaultTimeout(60000);

let driver;

BeforeAll(async () => {
  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');

  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().window.setRect({ width: 1920, height: 1080 });
  await driver.manage().timeouts().implicitlyWait(5000);
  await driver.manage().timeouts().pageLoadTimeout(30000);
});

Before(async () => {
  // Cada test comienza en la página de inicio
  await driver.get(process.env.BASE_URL || 'http://localhost:3002');
  await driver.sleep(1000);
});

After(async () => {
  // Limpiar cookies después de cada test
  try {
    await driver.manage().deleteAllCookies();
  } catch (e) {
    // ignore
  }
});

AfterAll(async () => {
  if (driver) {
    await driver.quit();
  }
});

// Exportar driver para usarlo en los tests
global.driver = driver;
