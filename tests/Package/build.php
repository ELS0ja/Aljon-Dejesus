<?php

$root = dirname(__DIR__, 2);
$destination = $root.'/artifacts/developer-portfolio-laravel.zip';
if (! is_dir(dirname($destination))) {
    mkdir(dirname($destination), 0775, true);
}
$archive = new ZipArchive;
if ($archive->open($destination, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
    throw new RuntimeException('Could not create the project archive.');
}

$rootFiles = [
    '.editorconfig', '.env.example', '.gitattributes', '.gitignore', '.npmrc',
    'AGENTS.md', 'CLAUDE.md', 'README.md', 'artisan', 'boost.json',
    'composer.json', 'composer.lock', 'package.json', 'package-lock.json',
    'phpunit.xml', 'tsconfig.json', 'vite.config.js', 'vercel.json', '.vercelignore',
];
$entries = [];
foreach ($rootFiles as $file) {
    if (is_file($root.'/'.$file)) {
        $archive->addFile($root.'/'.$file, $file);
        $entries[] = $file;
    }
}

foreach (['.agents', 'api', 'app', 'bootstrap', 'config', 'database', 'docs', 'public', 'resources', 'routes', 'storage', 'tests'] as $directory) {
    $iterator = new RecursiveCallbackFilterIterator(
        new RecursiveDirectoryIterator($root.'/'.$directory, FilesystemIterator::SKIP_DOTS),
        function (SplFileInfo $file) use ($root): bool {
            $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));

            return ! $file->isLink()
                && ! in_array($file->getFilename(), ['node_modules', '.git'], true)
                && ! str_starts_with($relative, 'storage/framework/tmp')
                && ! str_starts_with($relative, 'storage/framework/composer-cache');
        },
    );
    $files = new RecursiveIteratorIterator($iterator);
    foreach ($files as $file) {
        if (! $file->isFile() || $file->isLink()) {
            continue;
        }
        $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($root) + 1));
        if (preg_match('~(?:^|/)(?:node_modules|\.git)(?:/|$)|\.(?:sqlite(?:-shm|-wal)?|log)$~', $relative)) {
            continue;
        }
        if (str_starts_with($relative, 'bootstrap/cache/') && basename($relative) !== '.gitignore') {
            continue;
        }
        if (str_starts_with($relative, 'public/storage/') || $relative === 'public/hot') {
            continue;
        }
        if (str_starts_with($relative, 'storage/')) {
            $visual = str_starts_with($relative, 'storage/app/visual-qa/');
            $allowedVisual = $visual && (
                preg_match('~/(?:reference|local|comparisons)/[0-9]+-[a-z]+(?:-(?:diff|overlay|side))?\.png$~', $relative)
                || in_array(substr($relative, strlen('storage/app/visual-qa/')), [
                    'index.html', 'results.json', 'contact-results.json', 'reference/inventory.json',
                    'contact-failed-save.png', 'contact-saved.png',
                ], true)
            );
            if (! $allowedVisual && basename($relative) !== '.gitignore') {
                continue;
            }
            if (str_contains($relative, '/tmp/') || str_contains($relative, '/composer-cache/')) {
                continue;
            }
        }
        $archive->addFile($file->getPathname(), $relative);
        $entries[] = $relative;
    }
}
foreach (['resources/js/portfolio/vendor/design-system.js', 'resources/js/portfolio/vendor/design-system.d.ts', 'composer.lock', 'package-lock.json', 'public/build/manifest.json', '.env.example'] as $required) {
    if (! in_array($required, $entries, true)) {
        throw new RuntimeException('Required source omitted from archive: '.$required);
    }
}
$archive->close();
sort($entries);
file_put_contents(dirname($destination).'/manifest.json', json_encode([
    'archive' => basename($destination), 'sha256' => hash_file('sha256', $destination),
    'files' => count($entries), 'entries' => $entries,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES).PHP_EOL);
echo json_encode(['archive' => $destination, 'files' => count($entries), 'bytes' => filesize($destination)], JSON_UNESCAPED_SLASHES).PHP_EOL;
