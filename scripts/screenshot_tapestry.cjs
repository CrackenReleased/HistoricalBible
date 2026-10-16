const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:5173/tapestry.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'test-results/tapestry_view.png', fullPage: true });
  console.log('Saved tapestry_view.png');
  
  await browser.close();
})();
