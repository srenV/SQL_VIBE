const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const start = Date.now();
  await page.goto('http://localhost:3456/', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - start;

  // Collect Performance metrics from the Performance API
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    return {
      domComplete: nav ? nav.domComplete : null,
      loadEventEnd: nav ? nav.loadEventEnd : null,
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
      lcp: performance.getEntriesByType('element-timing').length
        ? performance.getEntriesByType('element-timing')[0].startTime
        : null,
      ttfb: nav ? nav.responseStart : null,
    };
  });

  // Accessibility checks (basic DOM inspection)
  const a11y = await page.evaluate(() => {
    const results = {};
    results.lang = document.documentElement.lang || null;
    results.title = document.title || null;
    results.metaViewport = !!document.querySelector('meta[name="viewport"]');
    results.metaDescription = !!document.querySelector('meta[name="description"]');
    results.imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])')).map(i => i.src);
    results.buttonsWithoutName = Array.from(document.querySelectorAll('button:not([aria-label]):not([title])')).filter(b => !b.textContent.trim()).length;
    results.inputsWithoutLabel = Array.from(document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([id])')).length;
    results.ariaHiddenBody = document.body.getAttribute('aria-hidden') === 'true';
    results.headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => h.tagName + ':' + h.textContent.trim().slice(0,20));
    return results;
  });

  // SEO checks
  const seo = await page.evaluate(() => {
    const results = {};
    results.title = document.title || null;
    results.metaDescription = document.querySelector('meta[name="description"]')?.content || null;
    results.canonical = document.querySelector('link[rel="canonical"]')?.href || null;
    results.robotsMeta = document.querySelector('meta[name="robots"]')?.content || null;
    results.lang = document.documentElement.lang || null;
    return results;
  });

  // Best practices checks
  const bp = await page.evaluate(() => {
    const results = {};
    results.doctype = document.doctype ? document.doctype.name : null;
    results.charset = document.characterSet || null;
    results.consoleErrors = (window.__consoleErrors || []).length;
    results.httpsLinks = Array.from(document.querySelectorAll('a[href^="http"]')).some(a => a.protocol === 'https:');
    return results;
  });

  const report = {
    loadTimeMs: loadTime,
    performance: perf,
    accessibility: a11y,
    seo,
    bestPractices: bp,
  };

  fs.writeFileSync('/tmp/manual-audit.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  await browser.close();
})();
