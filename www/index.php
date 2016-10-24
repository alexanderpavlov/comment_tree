<?php

require_once('../App/Config.php');
require_once('../Lib/Smarty/Smarty.class.php');

App\Config::init();

$route = $_SERVER['REQUEST_URI'];

try {
    $app = new \App\Application($route);
    $app->execute();
}
catch (Exception $e) {
    error_log($e->getMessage());
    exit;
}