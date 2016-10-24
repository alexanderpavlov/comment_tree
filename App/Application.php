<?php

namespace App;

use App\Controllers\IndexController;

class Application
{
    public $controller;
    public $action;
    public $args = array();
    public $isRest = false;

    public function __construct($route)
    {
        if ($removeGetQuery = strpos($route, '?')) {
            $route = substr($route, 0, $removeGetQuery);
        }

        $routes = explode('/', $route);

        if (is_array($routes) && count($routes)) {
            $this->isRest = $routes[1] == 'rest';
            unset($routes[1]);

            foreach ($routes as $element) {
                $element = trim($element);

                if (empty($element)) {
                    continue;
                }

                if (empty($this->controller)) {
                    $this->controller = ucfirst($element) . ($this->isRest ? 'Rest' : '') . 'Controller';
                    continue;
                }

                if (empty($this->action) && !$this->isRest) {
                    $this->action = $element;
                    continue;
                }

                $this->args[] = $element;
            }
        }

        if (empty($this->controller) && !$this->isRest) {
            $this->controller = 'IndexController';
        }

        if (empty($this->action) && !$this->isRest) {
            $this->action = 'index';
        }

        $this->controller = '\\App\\Controllers\\' . ($this->isRest ? 'Rest\\' : '') . $this->controller;
    }

    public function execute()
    {
        try {
            $controller = new $this->controller;
        } catch (\Exception $e) {
            $this->page404();
            exit;
        }

        if($this->isRest) {
            switch(strtolower($_SERVER['REQUEST_METHOD'])) {
                case 'get' : {
                    if(isset($this->args[0])) {
                        $this->action = 'get';
                    }
                    else {
                        $this->action = 'getCollection';
                    }

                    break;
                }
                case 'put' : $this->action = 'add'; break;
                case 'post' : $this->action = 'update'; break;
                case 'delete' : $this->action = 'delete'; break;
            }
        }

        if (!is_callable([$this->controller, $this->action])) {
            $this->page404();
            exit;
        }

        return call_user_func_array([$controller, $this->action], $this->args);
    }

    private function page404()
    {
        $controller = new IndexController();
        $controller->page404();
    }
}