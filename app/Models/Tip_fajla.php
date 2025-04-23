<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tip_fajla extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'tip_fajla';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'tip_fajla_id';


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
    public static function getTipFajla($id)
    {
        return self::where('id_tipa_fajla', $id);
    }

}
