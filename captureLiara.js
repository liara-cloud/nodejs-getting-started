const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'wss://hchrome.iran.liara.run?token=vV28xrolV1TEzeg7tX6',
  });
  const page = await browser.newPage();
  
  await page.goto('https://liara.ir');
  
  await page.screenshot({ path: 'liara_screenshot.png' });

  await browser.close();
})();
