<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use HasFactory;

class Departman extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'departman';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'departman_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv'];

    /**
     * Vraca sve departmane iz tabele Departmani
     */
    public static function getDepartmani()
    {
        return self::all();
    }
}
