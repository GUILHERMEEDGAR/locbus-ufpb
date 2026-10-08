const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const outputDir = path.join(__dirname, '../artifacts/screenshots/slides_review');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const filePath = 'file:///' + path.resolve(__dirname, '../apresentacao_15min/slides_interativos.html').replace(/\\/g, '/');
  console.log(`Carregando: ${filePath}`);
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  const slidesToCapture = [1, 6, 7, 9, 11];

  for (const s of slidesToCapture) {
    await page.evaluate((num) => {
      showSlide(num);
    }, s);
    await new Promise(r => setTimeout(r, 400));
    const outPath = path.join(outputDir, `slide_${s}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Slide ${s} capturado em: ${outPath}`);
  }

  // Also test speaker notes drawer
  await page.evaluate(() => {
    toggleNotes();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outputDir, 'slide_11_with_notes.png') });
  console.log(`Slide 11 com notas capturado.`);

  await browser.close();
  console.log('Finalizado com sucesso!');
})();
