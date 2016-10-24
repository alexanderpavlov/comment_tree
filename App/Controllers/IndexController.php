<?php

namespace App\Controllers;

use App\Models\Comment;

class IndexController extends Controller
{
    private $commentModel;

    public function __construct()
    {
        $this->commentModel = new Comment();
    }

    public function index()
    {
        $this->_view('index', ['comments' => $this->commentModel->getAll()]);
    }
}