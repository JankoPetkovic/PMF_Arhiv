<?php

namespace App\Models;
use App\Models\Tip_Fajla;

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
    protected $fillable = ['naziv', 'predmet_id','podtip_materijala_id', 'skolska_godina', 'korisnik_id', 'datum_dodavanja'];

    /**
     * Vraca sve materijale iz tabele Materijal
     */
    public static function getMaterijalPoTipu($predmet,$tipovi_materijala)
    {
        $query = self::with(['tipFajla', 'tipMaterijala', 'korisnik', 'predmet'])
        ->where('predmet_id', $predmet);

        if (!empty($tipovi_materijala)) {
        $query->whereIn('tip_materijala_id', $tipovi_materijala);
        }

       $materijali = $query->get();

        return $materijali->map(function ($m) {
        return [
            'materijal_id' => $m->materijal_id,
            'naziv' => $m->naziv,
            'tip_fajla' => $m->tipFajla->naziv ?? null,
            'tip_materijala' => $m->tipMaterijala->naziv ?? null,
            'email' => $m->korisnik->email ?? null,
            'predmet_id' => $m->predmet_id,
            'datum_dodavanja' => $m->datum_dodavanja,
            'datum_materijala' => $m->datum_materijala,
            ];
        });
    }

    public static function kreirajMaterijal($naziv, $predmetId, $podTipMaterijalaId, $skolskaGodina, $korisnikId){
        self::create([
            'naziv' => $naziv,
            'predmet_id' => $predmetId,
            'podtip_materijala_id' => $podTipMaterijalaId,
            'skolska_godina' => $skolskaGodina,
            'korisnik_id' => $korisnikId
        ]);

        return true;
    }

    public function predmet()
    {
        return $this->belongsTo(Predmet::class, 'predmet_id');

    }

    public function getTipMaterijala()
    {
        return $this->belongsTo(Tip_materijala::class, 'tip_materijala_id');
    }

    public function tipFajla()
    {
        return $this->belongsTo(Tip_fajla::class, 'tip_fajla_id');
    }

    public function tipMaterijala()
    {
        return $this->belongsTo(Tip_materijala::class, 'tip_fajla_id');
    }

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }
}
