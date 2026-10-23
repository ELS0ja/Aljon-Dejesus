const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright-core');

const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const report = {};

async function activePhoto(page) {
    return page.locator('.about-slideshow__dot[aria-current="true"]').evaluate(el =>
        [...el.parentElement.children].indexOf(el));
}

async function expectPhoto(page, index) {
    const deadline = Date.now() + 3000;
    while (Date.now() < deadline) {
        if (await activePhoto(page) === index) return;
        await delay(20);
    }
    assert.equal(await activePhoto(page), index);
}

async function releaseControls(page) {
    await page.evaluate(() => document.activeElement?.blur());
    await page.mouse.move(900, 700);
}

async function choose(page, index) {
    await page.locator('.about-slideshow__dot').nth(index).click();
    await expectPhoto(page, index);
    await releaseControls(page);
}

async function advance(page, ms) {
    await page.clock.runFor(ms);
    await delay(30);
}

// Bundle the real component in memory, without adding a fixture route to Laravel.
async function fixtureAssets() {
    const { build } = await import('vite');
    const component = path.resolve('resources/js/portfolio/components/AboutSlideshow.tsx').replaceAll('\\', '/');
    const data = path.resolve('resources/js/portfolio/data/about.ts').replaceAll('\\', '/');
    const result = await build({
        configFile: false,
        logLevel: 'error',
        define: { 'process.env.NODE_ENV': JSON.stringify('production') },
        plugins: [{
            name: 'slideshow-browser-fixture',
            resolveId(id) { if (id === 'slideshow-fixture') return '\0slideshow-fixture'; },
            load(id) {
                if (id !== '\0slideshow-fixture') return;
                return `
                    import React from 'react';
                    import { createRoot } from 'react-dom/client';
                    import { AboutSlideshow } from ${JSON.stringify(component)};
                    import { aboutPhotos } from ${JSON.stringify(data)};
                    let root;
                    window.fixturePhotos = aboutPhotos;
                    window.mountSlideshow = (photos = aboutPhotos) => {
                        root?.unmount();
                        root = createRoot(document.getElementById('fixture'));
                        root.render(React.createElement(AboutSlideshow, { photos }));
                    };
                    window.unmountSlideshow = () => { root?.unmount(); root = undefined; };
                    window.mountSlideshow();
                `;
            },
        }],
        build: {
            write: false,
            minify: false,
            cssCodeSplit: false,
            rollupOptions: { input: 'slideshow-fixture', output: { format: 'iife' } },
        },
    });
    const output = Array.isArray(result) ? result[0].output : result.output;
    return {
        js: output.find(file => file.type === 'chunk').code,
        css: output.filter(file => file.type === 'asset' && file.fileName.endsWith('.css')).map(file => file.source).join('\n'),
    };
}

async function fixture(browser, assets, options = {}) {
    const page = await browser.newPage({ viewport: { width: 1000, height: 900 }, reducedMotion: 'no-preference', ...options });
    const requests = new Set();
    page.on('request', request => requests.add(request.url()));
    const manifest = JSON.parse(fs.readFileSync('public/build/manifest.json', 'utf8'));
    const styles = manifest['resources/js/portfolio/index.tsx'].css;
    await page.route('**/__about-slideshow-test', route => route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">${styles.map(css => `<link rel="stylesheet" href="/build/${css}">`).join('')}
            <style>body{margin:0;background:#0b0f19}#fixture{width:min(320px,calc(100% - 40px));margin:20px}</style>
            <style>${assets.css}</style></head><body><div id="fixture"></div><script src="/__about-slideshow-test.js"></script></body></html>`,
    }));
    await page.route('**/__about-slideshow-test.js', route => route.fulfill({ contentType: 'text/javascript', body: assets.js }));
    await page.clock.install({ time: new Date('2026-10-24T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-24T00:00:01Z'));
    await page.goto(`${base}/__about-slideshow-test`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.about-slideshow');
    page.preloadRequests = [...requests];
    await page.evaluate(async () => {
        await Promise.all(window.fixturePhotos.map(async photo => {
            const image = new Image();
            image.src = photo.src;
            await image.decode();
        }));
    });
    return page;
}

(async () => {
    const assets = await fixtureAssets();
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    try {
        // Validate the production page, including the unchanged section layout.
        const baselinePath = 'storage/framework/tmp/about-layout-baseline.json';
        const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : null;
        for (const width of [375, 768, 1440]) {
            const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
            await page.goto(`${base}/#about`, { waitUntil: 'networkidle' });
            await page.evaluate(() => document.fonts.ready);
            await page.locator('#about').scrollIntoViewIfNeeded();
            const geometry = () => page.locator('#about').evaluate(section => {
                const bounds = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height }; };
                return { section: bounds(section), heading: bounds(section.querySelector('h2')), photo: bounds(section.querySelector('.about-slideshow__slide--active img')), biography: bounds(section.querySelector('.text-lg')), text: section.innerText };
            });
            const before = await geometry();
            if (baseline) assert.deepEqual(before, baseline[width], `${width}px original layout`);
            assert.equal(await page.locator('.about-slideshow__dot').count(), 4);
            assert.equal(await page.locator('.about-slideshow').getByRole('button', { name: /^(Pause slideshow|Play slideshow|Autoplay disabled for reduced motion)$/ }).count(), 0);
            assert.equal(await page.locator('.about-slideshow__slide--active img').getAttribute('src'), '/images/about-original.jpg');
            for (let index = 1; index < 4; index++) {
                await page.locator('.about-slideshow__dot').nth(index).click();
                await expectPhoto(page, index);
                assert.deepEqual(await geometry(), before, `${width}px layout stays stationary on slide ${index + 1}`);
            }
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            const styles = await page.locator('.about-slideshow').evaluate(el => ({ borderRadius: getComputedStyle(el).borderRadius, fit: getComputedStyle(el.querySelector('img')).objectFit, filter: getComputedStyle(el.querySelector('img')).filter }));
            assert.deepEqual(styles, { borderRadius: '16px', fit: 'cover', filter: 'none' });
            await page.locator('.about-slideshow__dot').first().click();
            await expectPhoto(page, 0);
            await page.screenshot({ path: `storage/app/visual-qa/personalized/${width}-about-slideshow.png`, fullPage: true });
            assert.deepEqual(errors, []);
            report[`${width}px`] = 'Original geometry and text preserved across all four slides; no overflow or asset errors';
            await page.close();
        }

        const page = await fixture(browser, assets, { viewport: { width: 1200, height: 900 } });
        const root = page.locator('.about-slideshow');
        const next = page.getByRole('button', { name: 'Next photo', exact: true });
        const previous = page.getByRole('button', { name: 'Previous photo', exact: true });
        await expectPhoto(page, 0);
        // Next photo has already been fetched before the first autoplay tick.
        const nextSrc = await page.evaluate(() => window.fixturePhotos[1].src);
        assert.equal(page.preloadRequests.some(url => url.endsWith(nextSrc)), true);
        await advance(page, 3999);
        await expectPhoto(page, 0);
        await advance(page, 1);
        await expectPhoto(page, 1);
        const crossfade = await root.evaluate(el => {
            const incoming = el.querySelector('.about-slideshow__slide--enter');
            const animation = incoming.getAnimations()[0];
            animation.pause();
            animation.currentTime = 350;
            return { duration: animation.effect.getTiming().duration, opacity: Number(getComputedStyle(incoming).opacity), outgoingOpacity: getComputedStyle(el.querySelector('[aria-hidden="true"]')).opacity };
        });
        assert.equal(crossfade.duration, 700);
        assert.ok(Math.abs(crossfade.opacity - 0.5) < 0.02);
        assert.equal(crossfade.outgoingOpacity, '1');
        await root.evaluate(el => el.querySelector('.about-slideshow__slide--enter').getAnimations()[0].finish());
        await delay(50);
        assert.equal(await root.locator('.about-slideshow__slide').count(), 1);
        for (const index of [2, 3, 0]) {
            await advance(page, 4000);
            await expectPhoto(page, index);
        }
        report.autoplay = '4-second timing, decoded next-image preload, 700ms crossfade with opaque outgoing image, continuous last-to-first loop';

        await root.hover();
        await advance(page, 12000);
        await expectPhoto(page, 0);
        await delay(180);
        assert.equal(await next.evaluate(el => getComputedStyle(el).opacity), '1');
        await releaseControls(page);
        await advance(page, 4000);
        await expectPhoto(page, 1);
        await next.focus();
        await advance(page, 12000);
        await expectPhoto(page, 1);
        await releaseControls(page);
        await advance(page, 4000);
        await expectPhoto(page, 2);
        await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
        await advance(page, 20000);
        await expectPhoto(page, 2);
        await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: false }); document.dispatchEvent(new Event('visibilitychange')); });
        await advance(page, 4000);
        await expectPhoto(page, 3);
        await advance(page, 4000);
        await expectPhoto(page, 0);
        report.pause = 'No pause/play button; hover, keyboard focus, visibility events, and automatic resumption passed';

        await root.hover();
        await previous.click();
        await expectPhoto(page, 3);
        await next.click();
        await expectPhoto(page, 0);
        await choose(page, 2);
        await advance(page, 3999);
        await expectPhoto(page, 2);
        await advance(page, 1);
        await expectPhoto(page, 3);
        await choose(page, 3); // Selecting the current dot must also reset autoplay.
        await advance(page, 3000);
        await choose(page, 3);
        await advance(page, 3999);
        await expectPhoto(page, 3);
        await advance(page, 1);
        await expectPhoto(page, 0);
        await next.focus();
        await page.keyboard.press('End');
        await expectPhoto(page, 3);
        await page.keyboard.press('Home');
        await expectPhoto(page, 0);
        await page.keyboard.press('ArrowRight');
        await expectPhoto(page, 1);
        assert.equal(await next.evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
        report.navigation = 'Previous/next wrapping, dots, repeated-current-dot timer reset, arrow/Home/End keys, visible focus';
        await page.close();

        const mobile = await fixture(browser, assets, { viewport: { width: 375, height: 900 }, isMobile: true, hasTouch: true });
        const mobileNext = mobile.getByRole('button', { name: 'Next photo', exact: true });
        assert.equal(await mobileNext.evaluate(el => getComputedStyle(el).opacity), '1');
        assert.ok((await mobileNext.boundingBox()).width >= 44);
        const cdp = await mobile.context().newCDPSession(mobile);
        async function swipe(dx, dy = 0) {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 180 }] });
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200 + dx, y: 180 + dy }] });
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await delay(50);
        }
        await swipe(-90);
        await expectPhoto(mobile, 1);
        await swipe(90);
        await expectPhoto(mobile, 0);
        await swipe(0, 90);
        await expectPhoto(mobile, 0);
        report.touch = 'Real touch input: left/right swipes navigate, vertical swipe preserves slide, mobile arrows remain visible';
        await mobile.close();

        const reduced = await fixture(browser, assets, { reducedMotion: 'reduce' });
        await advance(reduced, 20000);
        await expectPhoto(reduced, 0);
        assert.equal(await reduced.locator('.about-slideshow__slides').getAttribute('aria-live'), 'polite');
        await reduced.getByRole('button', { name: 'Next photo', exact: true }).focus();
        await reduced.keyboard.press('Enter');
        await expectPhoto(reduced, 1);
        assert.equal(await reduced.locator('.about-slideshow__slide--enter').count(), 0);
        assert.equal(await reduced.locator('.about-slideshow__slide').count(), 1);
        await releaseControls(reduced);
        await reduced.emulateMedia({ reducedMotion: 'no-preference' });
        await advance(reduced, 50); // Let the browser deliver the media-query change event.
        assert.equal(await reduced.locator('.about-slideshow__slides').getAttribute('aria-live'), 'off');
        await advance(reduced, 4000);
        await expectPhoto(reduced, 2);
        await reduced.emulateMedia({ reducedMotion: 'reduce' });
        await advance(reduced, 50);
        await advance(reduced, 12000);
        await expectPhoto(reduced, 2);
        report.reducedMotion = 'Autoplay and crossfade disabled, manual controls work, runtime preference changes respected';

        await reduced.evaluate(() => window.mountSlideshow([window.fixturePhotos[0]]));
        await delay(50);
        assert.equal(await reduced.locator('.about-slideshow img').count(), 1);
        assert.equal(await reduced.locator('.about-slideshow button').count(), 0);
        await advance(reduced, 12000);
        assert.equal(await reduced.locator('.about-slideshow img').getAttribute('src'), '/images/about-original.jpg');
        await reduced.evaluate(() => window.mountSlideshow([]));
        await delay(50);
        assert.equal(await reduced.locator('.about-slideshow').count(), 0);
        report.fallback = 'One photo stays static with no controls; empty array renders no empty frame';
        await reduced.close();

        // Instrument only lifecycle boundaries, then exercise the actual component.
        const cleanup = await fixture(browser, assets);
        await cleanup.evaluate(() => {
            window.unmountSlideshow();
            window.slideshowAudit = { timers: new Set(), visibility: new Set(), media: new Set() };
            const nativeSet = window.setTimeout.bind(window);
            const nativeClear = window.clearTimeout.bind(window);
            window.setTimeout = (callback, duration, ...args) => {
                const id = nativeSet(() => { window.slideshowAudit.timers.delete(id); callback(...args); }, duration);
                if (duration === 4000) window.slideshowAudit.timers.add(id);
                return id;
            };
            window.clearTimeout = id => { window.slideshowAudit.timers.delete(id); nativeClear(id); };
            const add = document.addEventListener.bind(document);
            const remove = document.removeEventListener.bind(document);
            document.addEventListener = (type, listener, ...args) => { if (type === 'visibilitychange') window.slideshowAudit.visibility.add(listener); return add(type, listener, ...args); };
            document.removeEventListener = (type, listener, ...args) => { if (type === 'visibilitychange') window.slideshowAudit.visibility.delete(listener); return remove(type, listener, ...args); };
            const matchMedia = window.matchMedia.bind(window);
            window.matchMedia = query => {
                const media = matchMedia(query);
                const mediaAdd = media.addEventListener.bind(media);
                const mediaRemove = media.removeEventListener.bind(media);
                media.addEventListener = (type, listener, ...args) => { window.slideshowAudit.media.add(listener); return mediaAdd(type, listener, ...args); };
                media.removeEventListener = (type, listener, ...args) => { window.slideshowAudit.media.delete(listener); return mediaRemove(type, listener, ...args); };
                return media;
            };
            window.mountSlideshow();
        });
        await delay(50);
        for (const index of [1, 2, 3, 0, 0]) await choose(cleanup, index);
        assert.deepEqual(await cleanup.evaluate(() => ({ timers: window.slideshowAudit.timers.size, visibility: window.slideshowAudit.visibility.size, media: window.slideshowAudit.media.size })), { timers: 1, visibility: 1, media: 1 });
        await cleanup.evaluate(() => window.unmountSlideshow());
        await delay(50);
        assert.deepEqual(await cleanup.evaluate(() => ({ timers: window.slideshowAudit.timers.size, visibility: window.slideshowAudit.visibility.size, media: window.slideshowAudit.media.size })), { timers: 0, visibility: 0, media: 0 });
        report.cleanup = 'Repeated manual navigation keeps exactly one autoplay timer; unmount removes timer and visibility/media listeners';
        await cleanup.close();

        console.log(JSON.stringify(report, null, 2));
        fs.writeFileSync('storage/framework/tmp/about-slideshow-results.json', JSON.stringify(report, null, 2));
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
