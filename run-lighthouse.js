const lighthouse = require('lighthouse').default;
const fs = require('fs');

(async () => {
  // Manually launched Chrome is on port 9222
  const port = 9224;

  const result = await lighthouse('http://localhost:3456/', {
    port,
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
})();
