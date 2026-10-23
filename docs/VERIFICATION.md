# Verification results

Verified on 24 October 2026 (Asia/Manila). Reference inspection and implementation captures use the actual portfolio preview, with no Magic Patterns editor UI included.

After the reference comparison, the portfolio was personalized at the user's request to **ALJON DE JESUS**, with branding initials **ADJ**. The screenshot set below records the original placeholder copy before that personalization.

The hero code-card was subsequently replaced with the user's original photo in a responsive circular portrait frame using the existing blue/violet palette. The original was selected through a local file picker and copied unchanged to `public/images/profile-original.jpg`; matching SHA-256 hashes verified that no image bytes were altered. Its SHA-256 is `1d130b30a24beeaab09847d3944d0fa89619cf26c296ef145e786cba7574e4d4`. The circular crop and upright display orientation are applied through CSS only. The generated portrait candidate was rejected and removed from public assets. The historical reference screenshots do not represent this personalized hero.

## Functional verification

The About-section photo placeholder was replaced with the user's original workstation photo at `public/images/about-original.jpg`. The existing 4:5 card, rounded corners, and border are preserved. The file is copied unchanged, with SHA-256 `311497924b6e8452482c0fde00af12b880fa7b755b7cc52ee4326bbaed07710e`; only CSS fits it into the card.

Projects and Experience were subsequently removed from the rendered page and from desktop, mobile, and footer navigation. The hero button now opens Contact. Chrome checks at 375px, 768px, and 1440px confirmed the remaining Home, About, Skills, Education, and Contact sections, valid hash links, working mobile navigation and Contact Me button, unchanged original photo hashes, and no horizontal overflow or browser errors. TypeScript checking and the production build passed. The seven-section and project-interaction results below document the earlier reference baseline; those sections are no longer displayed.

The About photo now uses the reusable `AboutSlideshow` component and the `aboutPhotos` array in `resources/js/portfolio/data/about.ts`. Its four photos start with the workstation photo, followed by the three supplied group photos. All files were copied unchanged; individual crops use CSS `object-position`. The original About section, heading, photo bounds, biography bounds, and visible text were recorded before implementation and matched exactly afterward at 375px, 768px, and 1440px, including after every manual slide change.

`npm.cmd run test:slideshow` passed in Chrome. It checks the four-second interval, decoded next-image preload, 700 ms fade with an opaque outgoing layer, last-to-first looping, hover/focus pauses, visibility-change handling, absence of a pause/play button, arrow and dot navigation, timer resets when selecting the current dot, keyboard focus and navigation, real emulated touch swipes, vertical touch scrolling, reduced-motion settings and runtime changes, single-photo/empty fallbacks, and timer/listener cleanup. Repeated navigation left exactly one autoplay timer; unmount removed it and the visibility/media listeners. The interaction fixtures bundle the actual component in memory and add no application routes. TypeScript and the production build passed. Mobile hardware and other browser engines were not independently tested.

| Check | Result |
| --- | --- |
| Laravel migrations and original five-project seeder | Passed on SQLite and isolated MySQL 8.4.3 |
| Complete PHPUnit suite | 25 tests, 98 assertions passed on SQLite and MySQL |
| TypeScript | `npm.cmd run typecheck` passed |
| Production assets | `npm.cmd run build` passed |
| Seven sections, original order, hidden empty certifications | Passed in Chrome at all five viewports |
| Category counts, combined search/filter, empty state, reset | Passed at all five viewports |
| Project details and original dialog composition | Passed at all five viewports |
| Dialog role, initial focus, focus trap, Escape, focus restoration | Passed at all five viewports after repairing the original shared dialog's missing behavior |
| Mobile menu keyboard opening, Escape, selection closing | Passed at 375px, 768px, and the actual 862px preview width |
| Required-field validation and character counter | Passed at all five viewports |
| Live contact submission and database read-back | Passed; the exact QA record was removed afterward |
| Duplicate clicks and idempotent server retries | Passed; one request for double activation, one stored record for replayed submission IDs |
| Invalid values, limits, honeypot, sender cooldown, IP rate limit | Passed in feature tests; honeypot and IP limit also verified over real HTTP |
| Cross-site request without a CSRF token | Rejected with HTTP 419 over real HTTP |
| Save failure | Feature test returns 503 and stores no record; browser preserves input and shows no success on a 503 response |
| Missing CV | Honest 404 response and user-facing feedback verified |
| Configured PDF | Download route verified with an isolated test PDF |
| Bootstrap escaping, safe project URLs, mass-assignment protection | Passed |
| Asset loading and horizontal overflow | No asset errors, no external resource requests, and no horizontal overflow in the five viewport checks |

The application intentionally does not send email. No email delivery is claimed or tested. No real CV was supplied; the real-content CV download remains dependent on adding that file. Personal details, projects, organization names, and dates remain the reference's clearly identified placeholders.

## Visual verification

Open `storage/app/visual-qa/index.html` for an offline gallery. Every capture has its reference and implementation PNG, a side-by-side image, an opacity overlay, and an image diff. Machine-readable measurements are in `storage/app/visual-qa/results.json`.

Both sides used installed **Chrome 155.0.8059.85**, zoom 100%, device scale 1, the same CSS viewport, content, scroll position, state, and reduced-motion setting. Fonts and assets finished loading before capture. Reveals and transitions were allowed to stabilize. The implementation uses the locally bundled original fonts.

| CSS viewport | Compared states | Strictly identical | Differences at pixelmatch threshold 0.1 |
| --- | ---: | ---: | ---: |
| 375 × 900 | 16 | 16 | 0 |
| 768 × 900 | 16 | 16 | 0 |
| **862 × 902 — actual embedded preview** | 16 | 16 | 0 |
| 1024 × 900 | 15 | 14 | 0 |
| 1440 × 900 | 15 | 14 | 0 |
| Total | **78** | **76** | **0** |

The states include full-page views, Home, About, Skills, Projects, Experience, Education, Contact, footer, keyboard focus, project hover, selected category, empty search, open project details, contact validation, and the mobile menu where applicable.

### Remaining strict differences

The 1024px and 1440px **full-page** PNGs have small RGB differences despite identical page dimensions and matching individual-section captures:

- 1024px: 136,692 strict differing pixels out of 7,898,112. Of these, 134,678 differ by only one RGB level. Maximum channel difference: 11/255, occurring on two pixels.
- 1440px: 177,443 strict differing pixels out of 10,631,520. Of these, 174,881 differ by one RGB level. Maximum channel difference: 3/255, occurring on two pixels.

Neither capture has a detected difference at the documented perceptual threshold. These small full-page color variations remain unresolved; their exact rendering cause has not been established. This result is **not** a claim that every screenshot is pixel-identical.

## Scope and intentional changes

- The dialog now has accessibility and keyboard behavior missing from the reference. Its captured appearance matches.
- Contact success confirms a real database save, replacing the reference's browser-only preview message. Failure and success layouts are preserved; additional live-state screenshots are included separately from matched visual comparisons.
- CV controls explain a missing CV instead of downloading a placeholder text file.
- Backend storage is verified on both database engines. The existing workspace `.env` keeps its original SQLite configuration; `.env.example` provides MySQL setup.
- Other browser engines, operating systems, arbitrary intermediate widths, touch-device hardware, live production hosting, and Laragon Apache/Nginx virtual-host configuration have not been independently exercised. The README documents those deployment steps.
- Reduced-motion screenshots stabilize the visual comparison. The original animation code and durations are preserved; continuous animation frames are outside the pixel comparison.

## Packaging and installation

The sanitized ZIP includes source, dependency lockfiles, `.env.example`, migrations, seed data, tests, built assets, original font files and licenses, documentation, screenshots, and the offline gallery. It excludes `.env`, installed dependencies, received messages, local databases, logs, caches, private CVs, and temporary QA installations.

Recreate it with `php tests/Package/build.php`. `artifacts/manifest.json` records its file list and SHA-256 digest.

Clean-extraction checks passed:

- Composer installed all 116 locked packages, including development dependencies, and completed package discovery.
- `npm.cmd ci --ignore-scripts` installed the 81 frontend packages from the lockfile.
- TypeScript checking and the production build passed in the extraction. Their final CSS and JavaScript filenames match the workspace build.
- A new application key was generated; a new SQLite database migrated and seeded successfully.
- All 25 tests / 98 assertions passed from the extracted project.

The initial packaging filter mistakenly excluded the source design-system folder because it was named `vendor`. Clean installation detected it. The filter now distinguishes source from installed dependency directories, and the archive builder requires both design-system files before accepting the package. The corrected extraction's frontend checks passed.

Vite reports non-fatal warnings about `/fonts/...` URLs being resolved at runtime and the reference's retained, browser-ignored `@custom-variant` directive. The font binaries are present under `public/fonts`, and real-browser checks confirm that all requested assets load locally. There are no frontend build failures or browser asset errors.
