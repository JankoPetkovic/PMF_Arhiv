<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Smer extends Model
{
    /**
     * Tabela koja predstavlja model
     * 
     * @var string
     */
    protected $table = 'smer';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'smer_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv_smera', 'departman_id', 'nivo_studija_id'];

    /**
     * Vraca sve smerove iz tabele smer
     */
    public static function getSmer()
    {
        return self::all();
    }


    public function getDepartman()
    {
        return $this->belongsTo(Departman::class, 'departman_id');
    }

    public function getNivoStudija()
    {
        return $this->belongsTo(Nivo_studija::class, 'nivo_studija_id');
    }
}
