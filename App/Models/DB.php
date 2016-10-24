<?php

namespace App\Models;

class DB
{
    protected static $pdo;

    public static function init($config)
    {
        try {
            static::$pdo = new \PDO(
                "mysql:host={$config['host']};dbname={$config['db']}",
                $config['user'],
                $config['password']
            );
        }
        catch (\PDOException $e) {
            $msg = 'Can\'t connect to DB (' . $e->getMessage() . ')';
            error_log($msg);
            exit;
        }
    }

    public static function execute($query, $args = [])
    {
        $prepared = static::$pdo->prepare($query);
        $prepared->execute($args);

        if((int) $prepared->errorCode()) {
            $msg = 'Can\'t do sql query (' . $query . ') error code (' . $prepared->errorCode() . ')';
            throw new \Exception($msg);
        }

        return $prepared->fetchAll(\PDO::FETCH_ASSOC);
    }

    public static function transaction($queries)
    {
        $insertedId = null;

        try {
            static::$pdo->beginTransaction();

            foreach($queries as $query) {
                if(is_array($query)) {
                    $prepared = static::$pdo->prepare($query[0]);
                    $prepared->execute($query[1]);
                }
                else {
                    static::$pdo->exec($query);
                }

                if(!$insertedId) {
                    $insertedId = static::getLastInsertId();
                }
            }

            static::$pdo->commit();

        } catch (\Exception $e) {
            static::$pdo->rollBack();
            $msg = "Transaction error: " . $e->getMessage();
            throw new \Exception($msg);
        }

        return $insertedId;
    }

    public static function getLastInsertId()
    {
        return static::$pdo->lastInsertId();
    }
}