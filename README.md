# Developer portfolio — Laravel migration

Laravel 13 / PHP 8.3 serves the original React 18 / TypeScript portfolio from [this Magic Patterns reference](https://www.magicpatterns.com/c/5czw9gfzccev6j4nz6n6qc). This is a migration of its public portfolio. Its editor, chat, toolbar, and preview controls are excluded.

The current portfolio shows Home, About, Skills, Education, and Contact. Projects and Experience have been removed from the page and navigation; the hero's Contact Me button opens Contact. Project records and backend support remain available in the repository. Contact submissions are validated and stored by Laravel. There is no public administration interface and no email delivery integration.

## Windows, VS Code, Laragon, and MySQL

1. Install Laragon with PHP **8.3 or newer** and MySQL **8.x**, Composer 2, Node.js **24 LTS**, and VS Code. Enable PHP's PDO MySQL, mbstring, OpenSSL, fileinfo, cURL, DOM, and XML extensions. `composer check-platform-reqs` checks the full requirements. PHP 8.3.26, Composer 2.9.5, Node 24.13.1, and MySQL 8.4.3 were used for verification.
2. Extract this project into `C:\laragon\www\dj`. In VS Code, use **File → Open Folder** and select that folder. Open a terminal there. Laragon's terminal supplies the PHP and Composer paths. Restart VS Code after changing PATH.
3. Start MySQL in Laragon. In HeidiSQL or another private database client, create the application database:

   ```sql
   CREATE DATABASE dj_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Install from the supplied lockfiles. PowerShell may block `npm.ps1`; use `npm.cmd` as shown:

   ```powershell
   composer install --no-interaction
   npm.cmd ci --ignore-scripts
   Copy-Item .env.example .env
   php artisan key:generate
   ```

   Preserve an existing `.env` instead of overwriting it. Set the correct local credentials:

   ```dotenv
   APP_URL=http://localhost:8000
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=dj_portfolio
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   A blank root password is only the usual local Laragon default; use the credentials configured on your computer.

5. Create the tables and the five clearly identified examples, then build the assets:

   ```powershell
   php artisan migrate --seed --no-interaction
   npm.cmd run build
   php artisan serve
   ```

   Open `http://localhost:8000`. The production build includes the original fonts; loading the portfolio does not require Google Fonts or a Magic Patterns account.

6. For Laragon's `dj.test` virtual host, set its **DocumentRoot** and directory permissions to `C:/laragon/www/dj/public`, then reload Apache. Set `APP_URL=http://dj.test` and run `php artisan config:clear`. Only `public/` may be exposed to the web. For Nginx, use that same public root and Laravel's usual `try_files $uri $uri/ /index.php?$query_string` rule. Do not serve the repository root.

For live frontend editing, leave `php artisan serve` running in one terminal and run `npm.cmd run dev` in another. Rebuild with `npm.cmd run build` before deployment. Stop the Vite dev server and remove a stale `public/hot` file if a copied project tries to load an unavailable dev server.

### SQLite alternative

SQLite is useful for an immediate local preview and automated tests. Enable `pdo_sqlite`, create `database/database.sqlite` if missing, and set:

```dotenv
DB_CONNECTION=sqlite
DB_DATABASE=C:/laragon/www/dj/database/database.sqlite
```

Then run the same migrations and seeders. The delivered archive excludes local databases, received messages, sessions, logs, caches, and `.env` secrets. MySQL remains the default in `.env.example`.

## Source layout and customization

| Path | Purpose |
| --- | --- |
| `resources/js/portfolio/` | Original React/TypeScript components and portfolio content |
| `resources/js/portfolio/data/` | Profile, biography, skills, experience, education, and original example project snapshot |
| `resources/js/portfolio/components/` | Original layout, sections, project illustrations, dialogs, and contact form |
| `resources/js/portfolio/vendor/design-system.js` | Original shared UI implementation recovered from the public source map, with bundled license notices |
| `resources/css/reference.css` | Preserved compiled reference styling used by the application |
| `resources/css/fonts.css`, `public/fonts/` | Local font declarations, original font binaries, and licenses |
| `resources/views/portfolio.blade.php` | Blade root, CSRF token, and safely serialized database content |
| `app/Http/` | Portfolio, contact, and CV controllers, contact validation, project serialization |
| `database/migrations/` | Projects, contact messages, and Laravel infrastructure tables |
| `database/seeders/data/projects.json` | The five original demonstration projects, including full dialog copy |
| `tests/Feature/Http/Controllers/` | Backend acceptance tests |
| `tests/Browser/` | Chrome interaction, screenshot, and live persistence checks |
| `storage/app/visual-qa/` | Reference and local captures, diffs, overlays, comparisons, and results |

Edit profile details in `resources/js/portfolio/data/profile.ts`, biography in `about.ts`, skills in `skills.ts`, experience in `experience.ts`, and education/certifications in `education.ts`. Certifications stay hidden while their array is empty. Rebuild assets after TypeScript changes. Set the `App` component's `showPlaceholderNotes` default to `false` to hide the original notes. They remain enabled for matching.

The About slideshow photos are configured in the `aboutPhotos` array in `resources/js/portfolio/data/about.ts`. Put original photo files in `public/images`, then add their `/images/filename.jpg` path, meaningful `alt` text, and an optional `position` such as `'42% 50%'` to adjust the crop. Optional `width` and `height` describe the original file. The first entry appears first; one entry displays a static photo without controls. The reusable component is `resources/js/portfolio/components/AboutSlideshow.tsx`, with styles in `resources/css/about-slideshow.css`. Photos remain unchanged; CSS applies the portrait crop.

Autoplay uses a four-second delay and a 700 ms crossfade. Hover, keyboard focus, or a hidden tab stop autoplay. The controls contain arrows and pagination dots. Reduced-motion settings disable autoplay and fades while keeping manual navigation available. With the local server running, verify the slideshow with `npm.cmd run test:slideshow`.

**Existing projects are edited in the database.** The gallery is currently hidden. `data/projects.ts` is retained as the original snapshot; project records remain in Laravel's bootstrap data. Seeders insert missing slugs and preserve subsequent database edits.

The original `index.css` and `tailwind.config.js` are retained for provenance. The build deliberately loads the compiled `resources/css/reference.css` snapshot, preserving the reference's generated CSS and shared component rules. Content changes require no style regeneration. If changing the design or adding utility classes, update the actual delivered stylesheet and repeat visual QA; compiling the original input with a different Tailwind version can change the result.

### Private project editing and message review

Use `php artisan tinker` locally or over an authenticated server shell. These operations have no public HTTP endpoint.

```php
$project = App\Models\Project::where('slug', 'student-management-system')->firstOrFail();
$project->title = 'Your real project title';
$project->description = 'Your accurate project description';
$project->technologies = ['Laravel', 'React', 'MySQL'];
$project->features = ['Describe an implemented feature'];
$project->github_url = 'https://github.com/your-account/your-project';
$project->demo_url = null;
$project->is_placeholder = false; // Only after replacing the example with real work.
$project->save();
```

Other editable fields are `slug` (unique), `category` (`Full-Stack`, `Backend`, or `Frontend`), `problem`, `contribution`, `display_order`, `thumbnail` (`dashboard`, `tasks`, `showcase`, `api`, or `landing`), and `accent` (`blue`, `violet`, or `emerald`). Repository and demo URLs are limited to HTTP/HTTPS when serialized to the browser. Public text is rendered through React; bootstrap data uses Laravel's safe JavaScript encoding.

```php
App\Models\ContactMessage::latest()->limit(20)->get(['id', 'name', 'email', 'subject', 'is_read', 'created_at'])->toArray();
$message = App\Models\ContactMessage::findOrFail(1); // Use an actual message ID.
$message->message;
$message->forceFill(['is_read' => true])->save();
```

Messages remain private. Store only the records you need and apply your own retention policy. The application does not send email, even if a mail transport is configured. Its success text confirms database storage only.

### Real CV

Place a real PDF at `storage/app/private/cv.pdf`. `/cv` then serves it as a download. With no file, the original CV controls keep their labels and appearance and display “The CV is not configured yet” when activated. No placeholder document is offered as a real CV. Leave `profile.cvUrl` empty when using Laravel's route.

## Validation and security behavior

Contact limits match the original frontend: name 2–100 characters, email at most 254, subject 3–150, and message 20–5,000. Laravel repeats validation server-side, rejects a filled honeypot, applies CSRF protection and a five-attempt per-minute IP limit, and enforces a 60-second sender cooldown after a successful save.

Each submit attempt carries a UUID. A database unique constraint and atomic sender lock protect retries and concurrent submissions. Reusing a UUID with different content is rejected. The client prevents double clicks, retains the UUID after a network failure, preserves input on errors, and clears fields only after confirmed persistence. Submitted messages are never placed in browser local storage. A failed save returns an error without success feedback.

## Verification

```powershell
php artisan test --compact
npm.cmd run typecheck
npm.cmd run build
```

Run browser checks with a seeded application and installed Chrome:

```powershell
php artisan serve
# In another terminal:
node tests/Browser/smoke.cjs
node tests/Browser/contact.cjs
```

`CHROME_PATH` can select another installed Chrome executable. `PORTFOLIO_URL` can select a local server for the contact check. The contact check creates one clearly identified QA message, verifies its database record, and removes that exact test record. It also exercises the live rate limiter; wait a minute before repeating it.

`tests/Browser/portfolio.cjs` and `report.cjs` preserve the original reference comparison workflow. That suite expects the original seven sections and project interactions, so it does not validate the current personalized page.

Open `storage/app/visual-qa/index.html` for the offline comparison gallery. See [the reference inventory](docs/REFERENCE.md) and [verification report](docs/VERIFICATION.md) for matched viewport sizes, results, intentional behavior fixes, and limits. Passing backend tests alone is not treated as visual verification.

## Vercel deployment

The repository includes `vercel.json` and `api/index.php` for the `vercel-php@0.9.0` community runtime (PHP 8.5). The frontend builds with Vite and static assets are served from `public`. Laravel handles page rendering, contact submissions, and CV downloads. Temporary view and framework caches use Vercel's writable temporary directory. Contact records, sessions, and rate limits use the hosted database.

1. Sign in at [Vercel](https://vercel.com/new) with GitHub and import `ELS0ja/Aljon-Dejesus`.
2. Set **Project Name** to `aljon-dejesus`, **Framework Preset** to **Other**, and keep the repository root as the root directory. `vercel.json` supplies the install command, build command, and `public` output directory.
3. Connect an online database. For a new PostgreSQL database, use the project's **Storage** area to add [Neon](https://vercel.com/marketplace/neon/neon) on its Free plan, in Singapore if available. The integration supplies `DATABASE_URL`, which this application accepts for PostgreSQL. Enable the integration for Production and for any Preview environment you deploy; use separate preview branches/databases when available.
4. Add these in **Settings → Environment Variables** for the deployment environment:

   | Variable | Value |
   | --- | --- |
   | `APP_KEY` | Generate a new production key locally with `php artisan key:generate --show`, then paste it into Vercel. This command prints a key without changing your local `.env`. |
   | `DB_CONNECTION` | `pgsql` when using Neon |
   | `DB_SSLMODE` | `require` when using Neon |
   | `DATABASE_URL` | Added by the Neon integration; otherwise copy the PostgreSQL connection URL into this variable or `DB_URL`. |

   For an existing hosted MySQL database, set `DB_CONNECTION=mysql` and its `DB_URL`, or `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`. Configure the database provider's required TLS settings. Do not use `localhost`, Laragon's database, or an on-function SQLite file. Keep database credentials and the production `APP_KEY` in Vercel, not in Git or chat. The public production defaults (debug disabled, secure cookies, database sessions/cache, stderr logging, and synchronous queue handling) are in `vercel.json`.
5. Deploy or redeploy after connecting the database and saving the environment variables. The community runtime runs Composer's `vercel` script: it verifies configuration, discovers packages, applies migrations, and inserts only missing example-project slugs. Configuration errors stop the build instead of deploying an application with an ephemeral database. Existing project records are preserved.
6. In **Settings → Domains**, confirm `aljon-dejesus.vercel.app` is assigned to Production. This exact address depends on its availability; the configuration does not reserve it. Test the page, photo slideshow, asset URLs, and a real contact submission after Vercel reports the deployment Ready.

No remote Vercel build or live URL is implied by local checks. Vercel account access, a configured hosted database, and a successful remote deployment are required. The original migration's screenshot comparison suite describes an older page; current frontend changes are documented above.

Run `node tests/Browser/vercel.cjs` to exercise the actual PHP entrypoint locally with a temporary database. It checks rendering, forwarded HTTPS, secure cookies, contact persistence and replay handling, CV/health routes, and temporary view compilation. It does not use your Laragon database or prove a remote Vercel build has succeeded.

## Production deployment

Use a host supporting PHP 8.3+, Composer, and MySQL. Set the web root to `public/`. Install production dependencies with `composer install --no-dev --optimize-autoloader --no-interaction`. Build frontend assets using `npm.cmd ci --ignore-scripts` and `npm.cmd run build` locally or in CI, then deploy `public/build` and `public/fonts` with the source. Installed Node packages are unnecessary at runtime.

Configure a unique `APP_KEY`, correct HTTPS `APP_URL`, production database credentials, `APP_ENV=production`, `APP_DEBUG=false`, and `SESSION_SECURE_COOKIE=true`. Give the PHP user write access to `storage/` and `bootstrap/cache/`. Run `php artisan migrate --force`; seed examples only if wanted. Then run `php artisan config:cache`, `php artisan route:cache`, and `php artisan view:cache`. No queue worker or mail service is needed for contact storage. Keep private CVs and database backups outside the web root.

The project ZIP excludes secrets and installed dependency folders. A supplied build is included, but dependency lockfiles are the installation authority. Run the same checks after deployment, especially contact storage and the CV route.
