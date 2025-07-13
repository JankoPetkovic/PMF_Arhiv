<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class NivoStudija extends Model
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
     * Relacija sa smerovima
     */
    public function smerovi(): HasMany
    {
        return $this->hasMany(Smer::class, 'nivo_studija_id', 'nivo_studija_id');
    }
}
