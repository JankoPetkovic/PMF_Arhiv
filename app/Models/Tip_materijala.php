<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tip_materijala extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'tip_materijala';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'tip_materijala_id';


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
     * Vraca sve redove iz tabele 
     */

    public static function getTipMaterijala()
    {
        return self::all();
    }
}
