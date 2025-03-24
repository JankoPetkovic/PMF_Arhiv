<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fajl extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'fajl';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'fajl_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['putanja_fajla', 'tip_fajla'];

    /**
     * Vraca sve departmane iz tabele Departmani
     */
    public static function getFajl()
    {
        return self::all();
    }
}
