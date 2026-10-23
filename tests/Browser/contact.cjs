const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { chromium } = require('playwright-core');

(async () => {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000';
    const report = {};
    try {
        await page.goto(base, { waitUntil: 'networkidle' });
        const token = await page.locator('meta[name="csrf-token"]').getAttribute('content');
        const headers = { Accept: 'application/json', 'X-CSRF-TOKEN': token };
        const csrf = await page.request.post(base + '/contact', { headers: { Accept: 'application/json', 'Sec-Fetch-Site': 'cross-site', Origin: 'https://example.invalid' }, data: {} });
        assert.equal(csrf.status(), 419);
        report.crossSiteRequestRejected = 419;
        const spam = await page.request.post(base + '/contact', { headers, data: { website: 'https://spam.invalid' } });
        assert.equal(spam.status(), 422);
        assert.ok((await spam.json()).errors.website);
        report.honeypotRejected = 422;

        await page.locator('#contact-name').fill('Browser QA');
        await page.locator('#contact-email').fill('browser-qa@example.invalid');
        await page.locator('#contact-subject').fill('Automated browser verification');
        await page.locator('#contact-message').fill('This test verifies real Laravel persistence and is removed after verification.');
        await page.route('**/contact', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Something went wrong saving your message. Please try again or email me directly.' }) }), { times: 1 });
        await page.getByRole('button', { name: 'Send message', exact: true }).click();
        await page.getByText('Something went wrong saving your message. Please try again or email me directly.', { exact: true }).waitFor();
        assert.equal(await page.locator('#contact-name').inputValue(), 'Browser QA');
        assert.equal(await page.locator('form .text-success').count(), 0);
        await page.screenshot({ path: 'storage/app/visual-qa/contact-failed-save.png' });
        report.failedSavePreservesInputWithoutSuccess = true;

        let posts = 0;
        let submitted;
        page.on('request', request => { if (request.method() === 'POST' && request.url().endsWith('/contact')) { posts++; submitted = request.postDataJSON(); } });
        const responsePromise = page.waitForResponse(response => response.request().method() === 'POST' && response.url().endsWith('/contact'));
        await page.locator('form').evaluate(form => { form.requestSubmit(); form.requestSubmit(); });
        const response = await responsePromise;
        assert.equal(response.status(), 201);
        await page.getByText('Thanks, Browser! Your message was received and saved.', { exact: true }).waitFor();
        assert.equal(posts, 1);
        assert.equal(await page.locator('#contact-message').inputValue(), '');
        assert.equal(await page.evaluate(() => localStorage.getItem('portfolio_contact_messages')), null);
        await page.screenshot({ path: 'storage/app/visual-qa/contact-saved.png' });
        report.doubleSubmitCreatesSingleRequest = true;
        report.realSubmission = 201;
        for (let attempt = 0; attempt < 2; attempt++) {
            const replay = await page.request.post(base + '/contact', { headers, data: submitted });
            assert.equal(replay.status(), 200);
            assert.equal((await replay.json()).duplicate, true);
        }
        report.serverReplaysAreIdempotent = true;
        const check = spawnSync('php', ['tests/Browser/assert-persistence.php', submitted.submission_id], { encoding: 'utf8' });
        assert.equal(check.status, 0, check.stdout + check.stderr);
        report.databasePersistenceVerifiedAndQaRecordRemoved = true;

        await page.request.post(base + '/contact', { headers, data: {} });
        const limited = await page.request.post(base + '/contact', { headers, data: {} });
        assert.equal(limited.status(), 429);
        report.liveRateLimit = 429;

        const dialogPromise = page.waitForEvent('dialog');
        await page.getByRole('button', { name: 'Download CV', exact: true }).click();
        const dialog = await dialogPromise;
        assert.match(dialog.message(), /CV is not configured/i);
        await dialog.accept();
        report.missingCvFeedback = true;
        console.log('CONTACT BROWSER PASS', JSON.stringify(report));
    } finally {
        fs.writeFileSync('storage/app/visual-qa/contact-results.json', JSON.stringify(report, null, 2));
        await browser.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
