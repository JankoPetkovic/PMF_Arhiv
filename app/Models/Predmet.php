<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Predmet extends Model
{   

    /**
     * Tabela koja predstavlja model
     * 
     * @var string
     */
    protected $table = 'predmet';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'predmet_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv', 'godina', 'smer_id'];

    public function smer()
    {
        return $this->belongsTo(Smer::class, 'smer_id');
    }
}
