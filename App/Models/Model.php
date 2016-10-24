<?php

namespace App\Models;

abstract class Model
{
    protected $table;
    protected $rules;

    public function getAll()
    {
        return DB::execute("SELECT * FROM {$this->table}");
    }

    public function get($id)
    {
        $result = DB::execute("SELECT * FROM {$this->table} WHERE id = ?", [$id]);

        return count($result) ? $result[0] : null;
    }

    public function add($data)
    {
        DB::execute($this->getPreparedAddQuery($data), $data);

        return DB::getLastInsertId();
    }

    public function update($id, $data)
    {
        if(!count($data)) {
            return false;
        }

        $sqlValues = [];

        foreach($data as $key => $value) {
            $sqlValues[] = "{$key} = :{$key}";
        }

        return DB::execute(
            "UPDATE {$this->table} SET ".implode(', ', $sqlValues)." WHERE id = :id",
            array_merge($data, ['id' => $id])
        );
    }

    public function delete($id)
    {
        return DB::execute("DELETE FROM {$this->table} WHERE id = ?", [$id]);
    }

    protected function getPreparedAddQuery($data)
    {
        if(!count($data)) {
            return false;
        }

        $sqlValues = [];

        foreach($data as $key => $value) {
            $sqlValues[] = "{$key} = :{$key}";
        }

        return "INSERT INTO {$this->table} SET ".implode(', ', $sqlValues);
    }

    public function getTotal()
    {
        return DB::execute("SELECT COUNT(id) AS total FROM {$this->table}")[0]['total'];
    }

    public function getValidateRules($keys = null)
    {
        if(!$keys) {
            return $this->rules;
        }

        $rules = [];

        foreach($keys as $key) {
            if(isset($this->rules[$key])) {
                $rules[$key] = $this->rules[$key];
            }
        }

        return $rules;
    }
}