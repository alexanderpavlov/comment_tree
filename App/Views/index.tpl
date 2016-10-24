<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Comment Tree</title>
    <link href="/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">
</head>

<body>

<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="/">Comment Tree</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
            </ul>
        </div>
    </div>
</nav>

<div class="container">
    <div class="main-wrapper">
        <button id="add-root-comment" class="btn btn-primary">Add comment</button>
        <div id="comments">

        </div>
    </div>
</div>

{include file='blocks/comment.tpl'}
{include file='modals/add_comment.tpl'}
{include file='modals/helpers.tpl'}

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/vendor/jquery/jquery.min.js"><\/script>')</script>
<script src="/vendor/bootstrap/js/bootstrap.min.js"></script>
<script src="/js/helpers.js"></script>
<script src="/js/rest.js"></script>
<script src="/js/models_and_collections.js"></script>
<script src="/js/main.js"></script>
</body>
</html>
