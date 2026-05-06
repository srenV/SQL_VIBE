const { chromium } = require('playwright');
const lighthouse = require('lighthouse').default;
const fs = require('fs');

const CHROME_PATH = process.env.HOME + '/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  // Get the remote debugging port (Playwright doesn't expose it directly,
  // but we can launch with a fixed port via env or connect over CDP).
  // Playwright doesn't easily expose the port; let's use chrome-launcher with the same binary instead.
  await browser.close();

  const chromeLauncher = require('chrome-launcher');
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    chromePath: CHROME_PATH,
  });

  const result = await lighthouse('http://localhost:3456/', {
    port: chrome.port,
    output: ['json', 'html'],
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    preset: 'desktop',
  });

  fs.writeFileSync('/tmp/lighthouse-report.json', JSON.stringify(result.lhr, null, 2));
  fs.writeFileSync('/tmp/lighthouse-report.html', result.report[1]);

  const categories = result.lhr.categories;
  console.log('Performance:', categories.performance.score);
  console.log('Accessibility:', categories.accessibility.score);
  console.log('Best Practices:', categories['best-practices'].score);
  console.log('SEO:', categories.seo.score);
  if (result.lhr.runtimeError) {
    console.log('runtimeError:', result.lhr.runtimeError.message);
  }

  await chrome.kill();
})();
