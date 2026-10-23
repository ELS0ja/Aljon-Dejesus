const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright-core');

const url = 'https://d6bd3c87-19e4-45ce-afcb-bc5fae5356b4-render.magicpatterns.app/';
const output = path.resolve('storage/app/visual-qa/reference');

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 862, height: 902 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const inventory = await page.evaluate(() => ({
        viewport: { width: innerWidth, height: innerHeight, scale: devicePixelRatio },
        title: document.title,
        sections: [...document.querySelectorAll('main > section')].map(el => ({ id: el.id, heading: el.querySelector('h1,h2')?.textContent, classes: el.className })),
        fonts: { body: getComputedStyle(document.body).fontFamily, heading: getComputedStyle(document.querySelector('h1')).fontFamily, mono: getComputedStyle(document.querySelector('code') || document.querySelector('.font-mono')).fontFamily },
        styles: [...document.querySelectorAll('link[rel="stylesheet"], style')].map(el => ({ href: el.href, content: el.tagName === 'STYLE' ? el.textContent : undefined })),
        text: document.querySelector('#root').innerText,
    }));
    fs.writeFileSync(path.join(output, 'inventory.json'), JSON.stringify(inventory, null, 2));
    console.log('INVENTORY', JSON.stringify({ ...inventory, text: undefined, styles: inventory.styles.map(s => ({ href: s.href, bytes: s.content?.length })) }));

    const fontDirectory = path.resolve('public/fonts');
    fs.mkdirSync(fontDirectory, { recursive: true });
    let fontCss = '';
    const css = fs.readFileSync('resources/css/reference.css', 'utf8');
    const imports = [...css.matchAll(/@import\s*"(https:\/\/fonts.googleapis.com[^"]+)";/g)];
    for (const match of imports) {
        const response = await page.request.get(match[1], { headers: { 'User-Agent': await page.evaluate(() => navigator.userAgent) } });
        if (!response.ok()) throw Error('Font CSS download failed: ' + response.status());
        let content = await response.text();
        for (const fontUrl of [...new Set([...content.matchAll(/url\(['"]?(https:[^)'"\s]+)['"]?\)/g)].map(m => m[1]))]) {
            const filename = crypto.createHash('sha256').update(fontUrl).digest('hex').slice(0, 20) + '.woff2';
            if (!fs.existsSync(path.join(fontDirectory, filename))) {
                const font = await page.request.get(fontUrl);
                if (!font.ok()) throw Error('Font download failed');
                fs.writeFileSync(path.join(fontDirectory, filename), await font.body());
            }
            content = content.split(fontUrl).join('/fonts/' + filename);
        }
        fontCss += content + '\n';
    }
    if (fontCss) fs.writeFileSync('resources/css/fonts.css', fontCss);
    fs.writeFileSync('resources/css/reference.css', css.replace(/@import\s*"https:\/\/fonts.googleapis.com[^"]+";/g, ''));
    console.log('LOCAL FONTS', fs.readdirSync(fontDirectory).filter(file => file.endsWith('.woff2')).length);
    if (process.argv.includes('--fonts-only')) { await browser.close(); return; }

    for (const [width, height] of [[375, 900], [768, 900], [862, 902], [1024, 900], [1440, 900]]) {
        await page.setViewportSize({ width, height });
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        for (const id of ['home', 'about', 'skills', 'projects', 'experience', 'education', 'contact']) {
            await page.locator('#' + id).scrollIntoViewIfNeeded();
            await page.waitForTimeout(650);
        }
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(750);
        await page.screenshot({ path: path.join(output, `${width}-full.png`), fullPage: true, animations: 'disabled' });
        console.log('CAPTURED', width);
    }
    await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
