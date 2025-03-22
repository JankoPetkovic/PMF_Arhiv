<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nivo_studija extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'nivo_studija';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'nivo_studija_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['nivo_studija'];

    /**
     * Vraca sve departmane iz tabele Departmani
     */
    public static function getNivoiStudija()
    {
        return self::all();
    }
}
