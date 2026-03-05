const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const htmlPath = '/Users/danielemarino/.cursor-tutor/Virale_Post_Analyse_2026.html';
  const pdfPath = '/Users/danielemarino/Desktop/Virale_Post_Analyse_2026.pdf';

  const html = fs.readFileSync(htmlPath, 'utf-8');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load HTML with full content
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '22mm',
      right: '20mm',
      bottom: '22mm',
      left: '20mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
      <div style="font-size: 9pt; color: #999; text-align: center; width: 100%; font-family: sans-serif;">
        <span class="pageNumber"></span>
      </div>
    `
  });

  await browser.close();
  console.log('PDF saved to:', pdfPath);
})();
