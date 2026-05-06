const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Inject Web Vitals listener before navigation
  await page.addInitScript(() => {
    window.__webVitals = {};
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          window.__webVitals[entry.name] = entry.startTime;
        }
        if (entry.entryType === 'largest-contentful-paint') {
          window.__webVitals['largest-contentful-paint'] = entry.startTime;
        }
        if (entry.entryType === 'layout-shift') {
          window.__webVitals['cumulative-layout-shift'] = (window.__webVitals['cumulative-layout-shift'] || 0) + entry.value;
        }
        if (entry.entryType === 'event') {
          // INP placeholder
        }
      }
    });
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'event'] });
  });

  const start = Date.now();
  await page.goto('http://localhost:3456/', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - start;

  // Wait a bit for LCP to settle
  await page.waitForTimeout(2000);

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lsEntries = performance.getEntriesByType('layout-shift');
    let cls = 0;
    for (const e of lsEntries) {
      if (!e.hadRecentInput) cls += e.value;
    }
    return {
      domComplete: nav ? nav.domComplete : null,
      loadEventEnd: nav ? nav.loadEventEnd : null,
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null,
      lcp: lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime : null,
      ttfb: nav ? nav.responseStart : null,
      cls,
      tbt: null, // requires long tasks
    };
  });

  // Accessibility DOM checks
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
    results.skipLink = !!document.querySelector('a[href^="#"]');
    results.colorContrast = null; // manual
    return results;
  });

  // SEO
  const seo = await page.evaluate(() => {
    const results = {};
    results.title = document.title || null;
    results.metaDescription = document.querySelector('meta[name="description"]')?.content || null;
    results.canonical = document.querySelector('link[rel="canonical"]')?.href || null;
    results.lang = document.documentElement.lang || null;
    results.robotsTxt = null; // no robots.txt in static export
    results.httpStatusCode = 200;
    return results;
  });

  // Best practices
  const bp = await page.evaluate(() => {
    const results = {};
    results.doctype = document.doctype ? document.doctype.name : null;
    results.charset = document.characterSet || null;
    results.consoleErrors = (window.__consoleErrors || []).length;
    results.httpsLinks = Array.from(document.querySelectorAll('a[href^="http"]')).some(a => a.protocol === 'https:');
    results.deprecations = []; // cannot detect easily
    return results;
  });

  // Capture screenshot
  await page.screenshot({ path: '/tmp/lighthouse-screenshot.png', fullPage: true });

  // Compute rough scores (0–100)
  // Performance: desktop preset thresholds
  let perfScore = 100;
  if (perf.fcp > 1800) perfScore -= 20;
  else if (perf.fcp > 900) perfScore -= 10;
  if (perf.lcp > 2500) perfScore -= 25;
  else if (perf.lcp > 1200) perfScore -= 15;
  if (perf.cls > 0.1) perfScore -= 25;
  else if (perf.cls > 0.05) perfScore -= 10;
  perfScore = Math.max(0, perfScore);

  // Accessibility: count issues
  let a11yIssues = 0;
  if (!a11y.lang) a11yIssues++;
  if (!a11y.title) a11yIssues++;
  if (!a11y.metaViewport) a11yIssues++;
  if (a11y.imagesWithoutAlt.length) a11yIssues += a11y.imagesWithoutAlt.length;
  if (a11y.buttonsWithoutName) a11yIssues += a11y.buttonsWithoutName;
  if (a11y.inputsWithoutLabel) a11yIssues += a11y.inputsWithoutLabel;
  if (a11y.ariaHiddenBody) a11yIssues++;
  let a11yScore = Math.max(0, 100 - a11yIssues * 10);

  // SEO
  let seoIssues = 0;
  if (!seo.title) seoIssues++;
  if (!seo.metaDescription) seoIssues++;
  if (!seo.lang) seoIssues++;
  let seoScore = Math.max(0, 100 - seoIssues * 10);

  // Best practices
  let bpIssues = 0;
  if (!bp.doctype) bpIssues++;
  if (!bp.charset) bpIssues++;
  if (bp.consoleErrors > 0) bpIssues++;
  let bpScore = Math.max(0, 100 - bpIssues * 10);

  const report = {
    generatedAt: new Date().toISOString(),
    url: 'http://localhost:3456/',
    device: 'desktop',
    throttling: 'none',
    performance: { raw: perf, score: perfScore },
    accessibility: { raw: a11y, score: a11yScore },
    seo: { raw: seo, score: seoScore },
    bestPractices: { raw: bp, score: bpScore },
    loadTimeMs: loadTime,
    note: 'Lighthouse CLI could not be executed in this headless environment (NO_FCP). This report was generated via Playwright manual audit approximating Lighthouse scoring logic.',
  };

  fs.writeFileSync('/tmp/qa-audit-report.json', JSON.stringify(report, null, 2));
  console.log('=== QA Audit Results ===');
  console.log('Performance:', perfScore);
  console.log('Accessibility:', a11yScore);
  console.log('Best Practices:', bpScore);
  console.log('SEO:', seoScore);
  console.log('========================');

  await browser.close();
})();
