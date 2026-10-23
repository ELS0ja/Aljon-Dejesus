const { chromium } = require('playwright-core');
(async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', e => console.log('PAGE ERROR', e.message));
    page.on('response', r => { if (r.status() >= 400) console.log('HTTP ERROR', r.status(), r.url()); });
    const response = await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    console.log('HTTP', response.status(), 'TITLE', await page.title());
    console.log(await page.locator('body').innerText());
    await page.screenshot({ path: 'storage/app/visual-qa/local-smoke.png', fullPage: true });
    await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
