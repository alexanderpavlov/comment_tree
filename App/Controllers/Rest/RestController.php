<?php

namespace App\Controllers\Rest;

use App\Controllers\Controller;

abstract class RestController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        global $_PUT;

        if($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $_PUT = [];
            $putData = file_get_contents('php://input');
            $exploded = explode('&', $putData);

            foreach($exploded as $pair) {
                $item = explode('=', $pair);
                if(count($item) == 2) {
                    $_PUT[urldecode($item[0])] = urldecode($item[1]);
                }
            }

            $this->input = $_PUT;
        }

        header('Content-Type: application/json');
    }

    abstract public function get($id);
    abstract public function getCollection();
    abstract public function add();
    abstract public function update($id);
    abstract public function delete($id);
}