<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="ALJON DE JESUS — Full-Stack Developer. Web applications, responsive interfaces, secure backends, and MySQL databases.">
    <meta name="theme-color" content="#0B0F19">
    <title>ALJON DE JESUS — Full-Stack Developer Portfolio</title>
    @viteReactRefresh
    @vite('resources/js/portfolio/index.tsx')
</head>
<body>
    <div id="root"></div>
    <script>window.__PORTFOLIO__ = {{ Illuminate\Support\Js::from($portfolio) }};</script>
</body>
</html>
