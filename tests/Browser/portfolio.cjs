const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright-core');
const { PNG } = require('pngjs');

const reference = 'https://d6bd3c87-19e4-45ce-afcb-bc5fae5356b4-render.magicpatterns.app/';
const local = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000';
const output = path.resolve('storage/app/visual-qa');
const widths = [[375, 900], [768, 900], [862, 902], [1024, 900], [1440, 900]];
const sections = ['home', 'about', 'skills', 'projects', 'experience', 'education', 'contact'];
const results = process.env.COMPARE_ONLY ? JSON.parse(fs.readFileSync(path.join(output, 'results.json'), 'utf8')) : { conditions: { browser: 'Chrome', zoom: 1, deviceScaleFactor: 1, reducedMotion: 'reduce', widths }, comparisons: [], browserChecks: [], errors: [] };

const pause = page => page.waitForTimeout(650);
async function scrollTo(page, id) {
    await page.evaluate(id => scrollTo(0, Math.max(0, document.getElementById(id).offsetTop - 80)), id);
    await page.mouse.move(0, 0);
    await pause(page);
}

async function capture(page, width, label, state, fullPage = false) {
    const folder = path.join(output, label);
    fs.mkdirSync(folder, { recursive: true });
    await page.screenshot({ path: path.join(folder, `${width}-${state}.png`), fullPage, animations: 'disabled' });
}

async function exercise(page, width, height, url, label) {
    await page.setViewportSize({ width, height });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    assert.deepEqual(await page.locator('main > section').evaluateAll(elements => elements.map(el => el.id)), sections);
    assert.equal(await page.locator('#projects article').count(), 5);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `${label} ${width}: horizontal overflow`);
    if (label === 'local') {
        assert.deepEqual(await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => !entry.name.startsWith(location.origin)).map(entry => entry.name)), [], 'All portfolio assets are served locally');
    }
    for (const id of sections) await scrollTo(page, id);
    await scrollTo(page, 'home');
    await capture(page, width, label, 'full', true);
    for (const id of [...sections, 'footer']) {
        if (id === 'footer') {
            await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
            await pause(page);
        } else await scrollTo(page, id);
        await capture(page, width, label, id);
    }

    await scrollTo(page, 'home');
    await page.keyboard.press('Tab');
    const explore = page.getByRole('button', { name: 'Explore My Projects', exact: true });
    await explore.focus();
    await pause(page);
    await capture(page, width, label, 'focus');
    await explore.evaluate(element => element.blur());
    await scrollTo(page, 'projects');
    await page.locator('#projects article').first().hover();
    await pause(page);
    await capture(page, width, label, 'hover');
    await page.mouse.move(0, 0);

    if (width < 1024) {
        await scrollTo(page, 'home');
        const toggle = page.getByRole('button', { name: 'Open menu', exact: true });
        await toggle.focus();
        await page.keyboard.press('Enter');
        await pause(page);
        assert.equal(await page.getByRole('button', { name: 'Close menu', exact: true }).getAttribute('aria-expanded'), 'true');
        await capture(page, width, label, 'menu');
        await page.keyboard.press('Escape');
        await pause(page);
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
        await toggle.click();
        await pause(page);
        await page.locator('#mobile-menu').getByRole('link', { name: 'About', exact: true }).click();
        await pause(page);
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    }

    await scrollTo(page, 'projects');
    await page.getByRole('button', { name: /^Full-Stack\s*3$/ }).click();
    await pause(page);
    assert.equal(await page.locator('#projects article').count(), 3);
    await scrollTo(page, 'projects');
    await capture(page, width, label, 'filtered');
    await page.getByLabel('Search projects', { exact: true }).fill('inventory');
    await pause(page);
    assert.equal(await page.locator('#projects article').count(), 0);
    await page.getByRole('button', { name: /^Backend\s*1$/ }).click();
    await pause(page);
    assert.equal(await page.locator('#projects article').count(), 1);
    assert.equal(await page.locator('#projects article h3').innerText(), 'Inventory REST API');
    await page.getByLabel('Search projects', { exact: true }).fill('zzzz-no-matching-project');
    await pause(page);
    await scrollTo(page, 'projects');
    await capture(page, width, label, 'empty');
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
    await pause(page);
    assert.equal(await page.locator('#projects article').count(), 5);

    await scrollTo(page, 'projects');
    const details = page.getByRole('button', { name: 'View Details', exact: true }).first();
    await details.click();
    const dialog = page.locator('[data-slot="dialog-content"]');
    await dialog.waitFor();
    await pause(page);
    await page.mouse.move(0, 0);
    assert.equal(await dialog.getByRole('heading', { name: 'Student Management System', exact: true }).count(), 1);
    assert.match(await dialog.innerText(), /the problem/i);
    await capture(page, width, label, 'dialog');
    if (label === 'local') {
        assert.equal(await dialog.getAttribute('role'), 'dialog');
        for (let index = 0; index < 8; index++) {
            await page.keyboard.press('Tab');
            assert.equal(await dialog.evaluate(el => el.contains(document.activeElement)), true, 'Dialog traps keyboard focus');
        }
        await page.keyboard.press('Escape');
    } else {
        results.browserChecks.push({ label, width, referenceLimitation: 'Original dialog has no role, focus trap, or Escape handler.' });
        await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    }
    await dialog.waitFor({ state: 'hidden' });
    const restored = await details.evaluate(el => el === document.activeElement);
    if (label === 'local') assert.equal(restored, true, 'Dialog restores trigger focus');
    results.browserChecks.push({ label, width, dialogFocusRestored: restored });

    await scrollTo(page, 'contact');
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await pause(page);
    assert.equal(await page.locator('#contact-name').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#contact-message-error').innerText(), 'Please write a message.');
    await scrollTo(page, 'contact');
    await capture(page, width, label, 'validation');
    await page.locator('#contact-message').fill('Checking the message counter.');
    assert.ok((await page.locator('form').innerText()).includes('29/5000'));
    results.browserChecks.push({ label, width, sections: 7, projects: 5, overflow: false, filtersAndSearch: true, dialog: true, validation: true, characterCounter: true });
    console.log('BROWSER PASS', label, width);
}

async function compare() {
    results.comparisons = [];
    const pixelmatch = (await import('pixelmatch')).default;
    const folder = path.join(output, 'comparisons');
    fs.mkdirSync(folder, { recursive: true });
    for (const file of fs.readdirSync(path.join(output, 'local')).filter(file => file.endsWith('.png'))) {
        const refPath = path.join(output, 'reference', file);
        if (!fs.existsSync(refPath)) continue;
        const ref = PNG.sync.read(fs.readFileSync(refPath));
        const implementation = PNG.sync.read(fs.readFileSync(path.join(output, 'local', file)));
        const sameDimensions = ref.width === implementation.width && ref.height === implementation.height;
        if (!sameDimensions) {
            results.comparisons.push({ file, sameDimensions, reference: [ref.width, ref.height], local: [implementation.width, implementation.height] });
            continue;
        }
        const diff = new PNG({ width: ref.width, height: ref.height });
        const changed = pixelmatch(ref.data, implementation.data, diff.data, ref.width, ref.height, { threshold: 0.1 });
        const exact = pixelmatch(ref.data, implementation.data, null, ref.width, ref.height, { threshold: 0, includeAA: true });
        const overlay = new PNG({ width: ref.width, height: ref.height });
        const side = new PNG({ width: ref.width * 2, height: ref.height });
        PNG.bitblt(ref, side, 0, 0, ref.width, ref.height, 0, 0);
        PNG.bitblt(implementation, side, 0, 0, ref.width, ref.height, ref.width, 0);
        for (let i = 0; i < ref.data.length; i++) overlay.data[i] = Math.round((ref.data[i] + implementation.data[i]) / 2);
        fs.writeFileSync(path.join(folder, file.replace('.png', '-diff.png')), PNG.sync.write(diff));
        fs.writeFileSync(path.join(folder, file.replace('.png', '-overlay.png')), PNG.sync.write(overlay));
        fs.writeFileSync(path.join(folder, file.replace('.png', '-side.png')), PNG.sync.write(side));
        results.comparisons.push({ file, sameDimensions, changedPixels: changed, exactChangedPixels: exact, totalPixels: ref.width * ref.height, changedPercent: +(changed / (ref.width * ref.height) * 100).toFixed(5) });
    }
}

(async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    results.conditions.browser = browser.version();
    try {
        for (const [width, height] of process.env.COMPARE_ONLY ? [] : widths) {
            for (const [label, url] of [['reference', reference], ['local', local]]) {
                const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
                if (label === 'local') {
                    page.on('pageerror', error => results.errors.push(error.message));
                    page.on('response', response => { if (response.status() >= 400) results.errors.push(`${response.status()} ${response.url()}`); });
                }
                await exercise(page, width, height, url, label);
                await page.close();
            }
        }
        await compare();
        assert.deepEqual(results.errors, []);
    } catch (error) {
        results.failure = error.stack;
        process.exitCode = 1;
    } finally {
        fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
        await browser.close();
    }
    console.log('RESULTS', JSON.stringify({ comparisons: results.comparisons.length, maxDifference: Math.max(...results.comparisons.map(r => r.changedPercent ?? 100)), errors: results.errors, failure: results.failure }));
})();
