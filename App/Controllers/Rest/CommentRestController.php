<?php

namespace App\Controllers\Rest;

use App\Models\AjaxResponse;
use App\Models\Comment;

class CommentRestController extends RestController
{
    private $commentModel;

    public function __construct()
    {
        parent::__construct();
        $this->commentModel = new Comment();
    }

    public function get($id)
    {
        return AjaxResponse::result($this->commentModel->get($id));
    }

    public function getCollection()
    {
        return AjaxResponse::result($this->commentModel->getAll());
    }

    public function add()
    {
        $input = $this->getInput('author', 'body', 'reply_to');
        $validateRules = $this->commentModel->getValidateRules();

        if($errors = $this->validationIsFail($input, $validateRules)) {
            return AjaxResponse::fail($errors);
        }

        $result = $this->commentModel->add($input);

        if(!$result) {
            return AjaxResponse::fail();
        }

        return AjaxResponse::result($result);
    }

    public function update($id)
    {
        $input = $this->getInput('author', 'body');
        $validateRules = $this->commentModel->getValidateRules(array_keys($input));

        if($errors = $this->validationIsFail($input, $validateRules)) {
            return AjaxResponse::fail($errors);
        }

        $this->commentModel->update($id, $input);

        return AjaxResponse::ok();
    }

    public function delete($id)
    {
        $this->commentModel->delete($id);
        return AjaxResponse::ok();
    }
}