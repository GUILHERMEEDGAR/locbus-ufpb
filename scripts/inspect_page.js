/**
 * scripts/inspect_page.js
 * Utilitário local para inspeção e testes automatizados de navegador com Puppeteer.
 * Substitui o browser_subagent de forma rápida, robusta e 100% offline.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function inspect(options = {}) {
  const url = options.url || 'http://localhost:8001';
  const isMobile = options.mobile || false;
  const clickSelector = options.click || null;
  const waitMs = options.wait || 2000;
  const screenshotName = options.screenshot || 'inspect_result.png';

  const screenshotsDir = path.resolve(__dirname, '../artifacts/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  const screenshotPath = path.join(screenshotsDir, screenshotName);

  const consoleLogs = [];
  const pageErrors = [];

  console.log(`[Puppeteer] Abrindo: ${url} (${isMobile ? 'Mobile' : 'Desktop'})`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    const context = browser.defaultBrowserContext();
    try {
      await context.overridePermissions(url, ['geolocation']);
      await page.setGeolocation({ latitude: -7.402100, longitude: -35.116400, accuracy: 12 });
    } catch (e) {
      console.log('Permissões de GPS não aplicadas no contexto:', e.message);
    }

    if (isMobile) {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    } else {
      await page.setViewport({ width: 1280, height: 800 });
    }

    // Capturar logs do console da página
    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    // Capturar erros não tratados com stack trace
    page.on('pageerror', err => {
      pageErrors.push(err.stack || err.message);
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    // Clicar em seletor opcional
    if (clickSelector) {
      console.log(`[Puppeteer] Clicando no elemento: ${clickSelector}`);
      await page.waitForSelector(clickSelector, { timeout: 5000 });
      await page.click(clickSelector);
      await new Promise(r => setTimeout(r, 1000));
    }

    // Espera configurada
    if (waitMs > 0) {
      await new Promise(r => setTimeout(r, waitMs));
    }

    // Extrair métricas da tela se existirem
    const pageState = await page.evaluate(() => {
      const lat = document.getElementById('val-lat')?.textContent;
      const lon = document.getElementById('val-lon')?.textContent;
      const points = document.getElementById('val-points-sent')?.textContent;
      const quality = document.getElementById('val-quality-pill')?.textContent;
      const logs = Array.from(document.querySelectorAll('.log-item')).slice(0, 5).map(el => el.textContent.trim());
      return { lat, lon, points, quality, recentLogs: logs };
    });

    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[Puppeteer] Screenshot salva em: ${screenshotPath}`);

    const result = {
      status: 'success',
      url,
      screenshot: screenshotPath,
      pageState,
      consoleLogs,
      pageErrors
    };

    console.log('\n--- RESULTADO DA INSPEÇÃO ---');
    console.log(JSON.stringify(result, null, 2));

    return result;
  } catch (err) {
    console.error(`[Puppeteer Error] ${err.message}`);
    return { status: 'error', error: err.message };
  } finally {
    await browser.close();
  }
}

// Execução via linha de comando
if (require.main === module) {
  const args = process.argv.slice(2);
  const opts = {
    url: args[0] || 'http://localhost:8001',
    mobile: args.includes('--mobile'),
    click: args.find(a => a.startsWith('--click='))?.split('=')[1] || null,
    wait: 2000
  };
  inspect(opts);
}

module.exports = { inspect };
