<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Encryption\Encrypter;

#[Signature('vercel:check')]
#[Description('Verify the production configuration required by Vercel')]
class CheckVercelDeployment extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $key = (string) config('app.key');
        $decodedKey = str_starts_with($key, 'base64:') ? base64_decode(substr($key, 7), true) : $key;

        if ($decodedKey === false || ! Encrypter::supported($decodedKey, config('app.cipher'))) {
            $this->error('Set a valid APP_KEY in Vercel Environment Variables before deploying.');

            return self::FAILURE;
        }

        if (config('app.debug')) {
            $this->error('Set APP_DEBUG=false for the production deployment.');

            return self::FAILURE;
        }

        $driver = config('database.default');

        if (! in_array($driver, ['mysql', 'mariadb', 'pgsql'], true)) {
            $this->error('Set DB_CONNECTION to mysql, mariadb, or pgsql and configure a hosted database. SQLite is not persistent on Vercel.');

            return self::FAILURE;
        }

        $connection = config('database.connections.'.$driver);
        $host = empty($connection['url']) ? ($connection['host'] ?? '') : parse_url($connection['url'], PHP_URL_HOST);

        if (empty($host) || in_array(strtolower($host), ['localhost', '127.0.0.1', '::1', '[::1]', '0.0.0.0'], true)) {
            $this->error('Configure DB_URL or DB_HOST with an online database. Vercel cannot connect to your local Laragon database.');

            return self::FAILURE;
        }

        $this->info('Vercel configuration checks passed.');

        return self::SUCCESS;
    }
}
