<?php

namespace App\Models;

class AjaxResponse
{
    static public function ok()
    {
        self::result([]);
        return true;
    }

    static public function result($data)
    {
        echo json_encode(['status' => 1, 'result' => $data]);
        return true;
    }

    static public function fail($errors = null)
    {
        if ($errors && is_array($errors) && is_array(current($errors))) {
            foreach ($errors as &$error) {
                if (is_array($error)) {
                    $error = $error[0];
                }
            }

            unset($error);
        }

        if (!is_array($errors)) {
            $errors = [$errors];
        }

        echo json_encode(['status' => 0, 'errors' => ($errors ?: ['Error'])]);
        return true;
    }
}
