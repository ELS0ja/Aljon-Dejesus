<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Vercel functions can write compiled views and framework manifests only in /tmp.
$runtimePath = sys_get_temp_dir().'/aljon-dejesus';

foreach ([$runtimePath.'/cache', $runtimePath.'/views'] as $directory) {
    if (! is_dir($directory) && ! @mkdir($directory, 0755, true) && ! is_dir($directory)) {
        throw new RuntimeException('Unable to create the Laravel runtime directory.');
    }
}

foreach ([
    'APP_CONFIG_CACHE' => $runtimePath.'/cache/config.php',
    'APP_EVENTS_CACHE' => $runtimePath.'/cache/events.php',
    'APP_PACKAGES_CACHE' => $runtimePath.'/cache/packages.php',
    'APP_ROUTES_CACHE' => $runtimePath.'/cache/routes.php',
    'APP_SERVICES_CACHE' => $runtimePath.'/cache/services.php',
    'VIEW_COMPILED_PATH' => $runtimePath.'/views',
] as $name => $path) {
    $_ENV[$name] = $path;
    $_SERVER[$name] = $path;
}

require __DIR__.'/../vendor/autoload.php';

/** @var Application $app */
$app = require __DIR__.'/../bootstrap/app.php';
$app->addAbsoluteCachePathPrefix($runtimePath);
$app->handleRequest(Request::capture());
