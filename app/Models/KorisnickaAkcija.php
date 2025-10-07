<?php

namespace App\Models;

use App\Models\TipKorisnickeAkcije;
use Illuminate\Database\Eloquent\Model;

class KorisnickaAkcija extends Model
{
    /**
     * Naziv tabele.
     */
    protected $table = 'korisnicke_akcije';

    /**
     * Primarni ključ.
     */
    protected $primaryKey = 'id';

    /**
     * Da li model koristi timestamps.
     */
    public $timestamps = true;

    /**
     * Laravel po defaultu koristi created_at i updated_at.
     * Ovde specificiramo da koristi kolonu vreme_akcije kao created_at.
     */
    const CREATED_AT = 'vreme_akcije';
    const UPDATED_AT = null; // jer tabela nema kolonu updated_at

    /**
     * Dozvoljene kolone za mass assignment.
     */
    protected $fillable = [
        'korisnik_id',
        'tip_korisnicke_akcije_id',
        'poruka',
        'vreme_akcije',
    ];

    /**
     * Relacija prema korisniku.
     */
    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

    /**
     * Relacija prema tipu korisničke akcije.
     */
    public function tipKorisnickeAkcije()
    {
        return $this->belongsTo(TipKorisnickeAkcije::class, 'tip_korisnicke_akcije_id');
    }

    public static function zabeleziAkciju($korisnikId, $tipAkcije, $poruka = null)
    {
        $tip = TipKorisnickeAkcije::where('naziv', $tipAkcije)->first();

        if (!$tip) {
            return null;
        }

        return self::create([
            'korisnik_id' => $korisnikId,
            'tip_korisnicke_akcije_id' => $tip->id,
            'poruka' => $poruka,
        ]);
    }
}
