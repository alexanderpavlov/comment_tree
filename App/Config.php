<?php

namespace App;

use App\Models\DB;

class Config
{
    public static function init()
    {
        $explodedPath = explode('/', __DIR__);
        unset($explodedPath[count($explodedPath) - 1]);
        $rootPath = implode('/', $explodedPath);

        define('ROOT_PATH', $rootPath . '/');
        define('APP_PATH', __DIR__ . '/');
        define('VIEWS_PATH', __DIR__ . '/Views/');
        define('LOG_PATH', ROOT_PATH . 'Log/');
        define('STORAGE_PATH', ROOT_PATH . 'Storage/');
        define('SMARTY_COMPILE_PATH', STORAGE_PATH . 'smarty_compile');
        define('SMARTY_CACHE_PATH', STORAGE_PATH . 'smarty_cache');
        define('WWW_PATH', ROOT_PATH . '/www/');

        ini_set('display_errors', true);
        ini_set('error_log', LOG_PATH . 'errors.log');
        ini_set('error_reporting', E_ALL);
        ini_set('log_errors', true);

        date_default_timezone_set("Europe/Moscow");

        spl_autoload_register(function ($class) {
            if (!@include_once(ROOT_PATH . str_replace('\\', '/', $class) . '.php')) {
                throw new \Exception('Couldn\'t include class "' . $class . '"');
            }
        });

        DB::init(static::getDBConfig());
    }

    public static function getDBConfig()
    {
        return [
            'host' => 'localhost',
            'user' => '%USER%',
            'password' => '%PASSWORD%',
            'db' => 'comment_tree',
        ];
    }
}