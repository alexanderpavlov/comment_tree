<?php

namespace App\Models;

class Comment extends Model
{
    protected $table = 'comments';

    public function __construct()
    {
        $this->rules = [
            'author' => function ($value) {
                if (!$value) {
                    return 'Author can\'t be empty';
                }

                return mb_strlen($value, 'utf8') < 255 ? true : 'Author can\'t has more than 255 symbols';
            },
            'body' => function ($value) {
                if (!$value) {
                    return 'Message can\'t be empty';
                }

                return mb_strlen($value, 'utf8') < 2000 ? true : 'Message can\'t has more than 2000 symbols';
            },
            'reply_to' => function ($value) {
                return (string)((int)$value) === (string)$value && $value >= 0 ? true : 'Invalid parameter "reply_to"';
            }
        ];
    }

    public function getAll()
    {
        return DB::execute("SELECT * FROM {$this->table} ORDER BY left_key");
    }

    public function add($data)
    {
        if ($data['reply_to']) {
            $comment = $this->get($data['reply_to']);

            if (!$comment) {
                return false;
            }

            $data['level'] = $comment['level'] + 1;
            $data['left_key'] = $comment['right_key'];
            $data['right_key'] = $comment['right_key'] + 1;
        } else {
            $total = $this->getTotal();
            $data['level'] = 0;
            $data['left_key'] = ($total + 1) * 2;
            $data['right_key'] = $data['left_key'] + 1;
        }

        $data['created_at'] = date('Y-m-d H:i:s');
        unset($data['reply_to']);

        $transactionQueries = [
            "UPDATE {$this->table} SET left_key = left_key + 2, right_key = right_key + 2 WHERE left_key > {$data['left_key']}",
            "UPDATE {$this->table} SET right_key = right_key + 2 WHERE right_key >= {$data['left_key']} AND left_key < {$data['left_key']}",
            [$this->getPreparedAddQuery($data), $data]
        ];

        $data['id'] = DB::transaction($transactionQueries);

        return $data;
    }

    public function delete($id)
    {
        $comment = $this->get($id);

        if(!$comment) {
            throw new \Exception('Can\'t delete comment because it doesn\'t exist!');
        }

        $left_key = $comment['left_key'];
        $right_key = $comment['right_key'];

        $transactionQueries = [
            "DELETE FROM {$this->table} WHERE left_key >= {$left_key} AND right_key <= {$right_key}",
            "UPDATE {$this->table} SET left_key = left_key – ({$right_key} - {$left_key} + 1), right_key = right_key – ({$right_key} - {$left_key} + 1) WHERE left_key > {$right_key}",
            "UPDATE {$this->table} SET left_key = IF(left_key > {$left_key}, left_key – ({$right_key} - {$left_key} + 1), left_key), right_key = right_key – ({$right_key} - {$left_key} + 1) WHERE right_key > {$right_key}",
        ];

        return DB::transaction($transactionQueries);
    }
}