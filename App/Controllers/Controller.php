<?php

namespace App\Controllers;

abstract class Controller
{
    protected $input;

    public function __construct()
    {
        $this->input = isset($_REQUEST) && count($_REQUEST) ? $_REQUEST : [];
    }

    public function page404() {
        $this->_view('errors/404');
    }

    protected function _view($name, $data = [])
    {
        $smarty = new \Smarty();
        $smarty->template_dir = VIEWS_PATH;
        $smarty->cache_dir = SMARTY_CACHE_PATH;
        $smarty->compile_dir = SMARTY_COMPILE_PATH;
        $smarty->assign($data);
        $smarty->display($name.'.tpl');
    }

    protected function getInput()
    {
        $keys = func_get_args();
        $result = [];

        foreach($keys as $key) {
            $result[$key] = isset($this->input[$key]) ? $this->input[$key] : null;
        }

        return $result;
    }

    public function validationIsFail($input, $rules)
    {
        $errors = [];

        foreach($rules as $key => $rule) {
            if(($result = $rule(isset($input[$key]) ? $input[$key] : null)) !== true) {
                $errors[] = $result;
            }
        }

        return count($errors) ? $errors : false;
    }
}