const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const net = require('node:net');
const crypto = require('node:crypto');
const http = require('node:http');
const vm = require('node:vm');
const { spawn, execFileSync } = require('node:child_process');

(async () => {
    const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-vercel-test-'));
    const database = path.join(fixtureDirectory, 'database.sqlite');
    fs.writeFileSync(database, '');
    const env = {
        ...process.env,
        APP_ENV: 'production', APP_DEBUG: 'false',
        APP_KEY: 'base64:' + crypto.randomBytes(32).toString('base64'),
        APP_URL: 'https://aljon-dejesus.vercel.app',
        DB_CONNECTION: 'sqlite', DB_DATABASE: database, DB_URL: '', DATABASE_URL: '',
        CACHE_STORE: 'database', SESSION_DRIVER: 'database', SESSION_SECURE_COOKIE: 'true',
        LOG_CHANNEL: 'stderr', QUEUE_CONNECTION: 'sync', VERCEL: '1',
    };
    // SQLite is an isolated test fixture. The actual deployment preflight rejects it.
    execFileSync('php', ['artisan', 'migrate', '--force', '--no-interaction'], { env, stdio: 'pipe' });
    execFileSync('php', ['artisan', 'db:seed', '--class=ProjectSeeder', '--force', '--no-interaction'], { env, stdio: 'pipe' });
    const probe = net.createServer();
    await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
    const port = probe.address().port;
    await new Promise(resolve => probe.close(resolve));
    const server = spawn('php', ['-S', `127.0.0.1:${port}`, 'api/index.php'], { env, windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    let logs = '';
    server.stderr.on('data', data => { logs += data; });
    try {
        const base = `http://127.0.0.1:${port}`;
        const headers = { Host: 'aljon-dejesus.vercel.app', 'X-Forwarded-Proto': 'https', 'X-Forwarded-Port': '443' };
        const request = (route, options = {}) => new Promise((resolve, reject) => {
            const outgoing = http.request(base + route, { method: options.method || 'GET', headers: { ...headers, ...options.headers }, timeout: 3000 }, incoming => {
                let body = '';
                incoming.setEncoding('utf8');
                incoming.on('data', chunk => { body += chunk; });
                incoming.on('end', () => resolve({ status: incoming.statusCode, headers: incoming.headers, body }));
            });
            outgoing.on('error', reject);
            outgoing.on('timeout', () => outgoing.destroy(new Error('Local entrypoint request timed out.')));
            outgoing.end(options.body);
        });
        let home;
        for (let attempt = 0; attempt < 30; attempt++) {
            try {
                home = await request('/');
                break;
            } catch {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        assert.equal(home?.status, 200, logs.slice(0, 2000));
        const html = home.body;
        assert.match(html, /ALJON DE JESUS/);
        const bootstrap = vm.runInNewContext(html.match(/window\.__PORTFOLIO__ = (.*);<\/script>/)[1]);
        assert.equal(bootstrap.contactUrl, 'https://aljon-dejesus.vercel.app/contact');
        const token = html.match(/name="csrf-token" content="([^"]+)"/)[1];
        const cookieHeaders = home.headers['set-cookie'] || [];
        assert.ok(cookieHeaders.some(cookie => /; secure/i.test(cookie)));
        const cookie = cookieHeaders.map(value => value.split(';')[0]).join('; ');
        const payload = {
            name: 'Vercel local check', email: 'vercel-check@example.invalid',
            subject: 'Serverless entrypoint verification',
            message: 'This isolated test verifies the Vercel entrypoint and persistent session.',
            submission_id: crypto.randomUUID(), website: '',
        };
        const submissionHeaders = { ...headers, Cookie: cookie, Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token };
        const submitted = await request('/contact', { method: 'POST', headers: submissionHeaders, body: JSON.stringify(payload) });
        assert.equal(submitted.status, 201, submitted.body);
        const replay = await request('/contact', { method: 'POST', headers: submissionHeaders, body: JSON.stringify(payload) });
        assert.equal(replay.status, 200);
        assert.equal(JSON.parse(replay.body).duplicate, true);
        const cv = await request('/cv', { headers: { Accept: 'application/json' } });
        assert.equal(cv.status, fs.existsSync('storage/app/private/cv.pdf') ? 200 : 404);
        assert.equal((await request('/up')).status, 200);
        assert.ok(fs.readdirSync(path.join(os.tmpdir(), 'aljon-dejesus/views')).some(file => file.endsWith('.php')));
        console.log('PASS: Vercel entrypoint renders the portfolio, uses forwarded HTTPS and secure cookies, saves/replays contact messages, handles CV/health routes, and compiles views in the temporary directory. The database is an isolated local fixture.');
    } finally {
        server.kill();
        await new Promise(resolve => server.once('exit', resolve));
        // Delete only the known files created by this test, never recursively.
        for (const name of ['database.sqlite', 'database.sqlite-wal', 'database.sqlite-shm']) {
            const file = path.join(fixtureDirectory, name);
            if (fs.existsSync(file)) fs.unlinkSync(file);
        }
        fs.rmdirSync(fixtureDirectory);
    }
})().catch(error => { console.error(error); process.exit(1); });
