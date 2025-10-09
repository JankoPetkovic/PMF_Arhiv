<?php

namespace App\Models;

use App\Models\TipKorisnickeAkcije;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class KorisnickaAkcija extends Model
{
    protected $table = 'korisnicke_akcije';

    protected $primaryKey = 'id';

    public $timestamps = true;

    const CREATED_AT = 'vreme_akcije';
    const UPDATED_AT = null;

    protected $fillable = [
        'korisnik_id',
        'tip_korisnicke_akcije_id',
        'poruka',
        'vreme_akcije',
    ];

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id');
    }

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
        
        Log::info("Korisnik: " . $korisnikId . ", ". $poruka);
        return self::create([
            'korisnik_id' => $korisnikId,
            'tip_korisnicke_akcije_id' => $tip->id,
            'poruka' => $poruka,
        ]);
    }
}
