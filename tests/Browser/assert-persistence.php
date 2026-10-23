<?php

use App\Models\ContactMessage;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$messages = ContactMessage::query()->where('submission_id', $argv[1] ?? '')->get();
if ($messages->count() !== 1 || $messages->first()->name !== 'Browser QA' || $messages->first()->is_read) {
    fwrite(STDERR, 'The browser submission was not stored once as an unread message.');
    exit(1);
}
$messages->first()->delete();
echo 'The real browser submission was saved once and its test record was removed.'.PHP_EOL;
