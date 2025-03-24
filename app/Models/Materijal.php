<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materijal extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'materijal';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'materijal_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['naziv', 'predmet_id', 'datum_dodavanja', 'datum_materijala', 'tip_materijala_id', 'fajl_id', 'korisnik_id'];

    /**
     * Vraca sve materijale iz tabele Materijal
     */
    public static function getMaterijal()
    {
        return self::all();
    }

    public function getPredmet()
    {
        return $this->belongsTo(Predmet::class, 'predmet_id');

    }

    public function getTipMaterijala()
    {
        return $this->belongsTo(Tip_materijala::class, 'tip_materijala_id');

    }

    public function getFajl()
    {

        return $this->belongsTo(Fajl::class, 'fajl_id');
    }

    public function getKorisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }
}
