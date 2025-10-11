<?php

namespace App\Models;

use App\Mail\Verifikacija;

use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use App\Models\KorisnickaAkcija;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Foundation\Auth\User as Authenticatable;

use App\Models\Smer;
use App\Models\Predmet;

class Korisnik extends Authenticatable
{
    protected $table = 'korisnik';

    protected $primaryKey = 'korisnik_id';

    public $timestamps = false;

    protected $fillable = ['ime', 'prezime','email', 'broj_indeksa','datum_verifikacije', 'sifra', 'godina'];

    protected $hidden = ['sifra'];

    protected $casts = [
        'datum_verifikacije' => 'datetime',
    ];

    public function smerovi(){
        return $this->belongsToMany(Smer::class, 'smerovi_korisnika', 'korisnik_id', 'smer_id');
    }

    public function predmeti(){
        return $this->belongsToMany(Predmet::class, 'predmeti_korisnika', 'korisnik_id', 'predmet_id');
    }

    public function korisnickeAkcije()
    {
        return $this->hasMany(KorisnickaAkcija::class, 'korisnik_id');
    }

    public function tipUloge()
    {
        return $this->belongsTo(TipUlogeKorisnika::class, 'tip_uloge_korisnika_id', 'id');
    }

    public static function kreirajKorisnika($podaci){
        $korisnik = self::create([
            'ime' => $podaci['ime'],
            'prezime' => $podaci['prezime'],
            'broj_indeksa' => $podaci['broj_indeksa'],
            'email' => $podaci['email'],
            'datum_verifikacije' => null,
            'sifra' => Hash::make($podaci['sifra']),
            'godina' => $podaci['godina'] ?? 1,
        ]);

        if (!empty($podaci['smerovi'])) {
            $korisnik->smerovi()->sync($podaci['smerovi']);
        }

        if (!empty($podaci['predmeti'])) {
            $korisnik->predmeti()->sync($podaci['predmeti']); 
        }

        $korisnik->posaljiVerifikaciju();

        return $korisnik;
    }

    public function prikaziKorisnika(){
        $podaciKorisnika = [
            'korisnik_id' => $this->korisnik_id,
            'ime' => $this->ime,
            'prezime' => $this->prezime,
            'broj_indeksa' => $this ->broj_indeksa,
            'korisnicki_email' => $this->email,
            'status_verifikacije' => $this->statusVerifikacije(),
            'smerovi_korisnika' => $this->smerovi->map(function ($smer) {
                    return [
                        'smer_id' => $smer->smer_id,
                        'naziv_smera' => $smer->naziv_smera,
                        'nivo_studija' => $smer->nivoStudija->nivo_studija,
                    ];
                })->toArray(),
                'predmeti_korisnika' => $this->predmeti->map(function ($predmet) {
                    return [
                        'predmet_id' => $predmet->predmet_id,
                        'naziv' => $predmet->naziv,
                    ];
                })->toArray(),
            'godina' => $this->godina,
            'uloga' => $this->tipUloge->naziv,
        ];

        return $podaciKorisnika;
    }

    public function azurirajKorisnika($podaci){
        $updatePodaci = array_filter($podaci, function($vrednost, $kljuc) {
            return in_array($kljuc, ['ime', 'prezime', 'broj_indeksa', 'email', 'datum_verifikacije', 'godina']) && $vrednost !== null;
        }, ARRAY_FILTER_USE_BOTH);

        $this->update($updatePodaci);

        if (array_key_exists('izabraniSmerovi', $podaci)) {
            $this->smerovi()->sync($podaci['izabraniSmerovi']);
        }
    }

    public function statusVerifikacije()
    {
        $trajanje = (int) env('VERIFIKACIJA_TRAJANJE_MESECI', 1);

        if (!$this->datum_verifikacije) {
            return [
                'verifikovan' => false,
                'statusVerifikacije' => false,
            ];
        }

        $datumVerifikacije = $this->datum_verifikacije;
        $istekVerifikacije = $datumVerifikacije->copy()->addMonths($trajanje);
        if ($datumVerifikacije->gte(now()->subMonths($trajanje))) {
            return [
                'verifikovan' => true,
                'statusVerifikacije' => $istekVerifikacije->format('d.m.Y'),
            ];
        }

        return [
            'verifikovan' => false,
            'statusVerifikacije' => $istekVerifikacije->format('d.m.Y'),
        ];
    }


    public function posaljiVerifikaciju(){
        $link = URL::temporarySignedRoute(
            'korisnik.verifikuj',
            Carbon::now()->addMinutes(10),
            ['id' => $this->korisnik_id]
        );
        try {
            Mail::to($this->email)->send(new Verifikacija($this->email, $link));
        } catch (\Exception $e) {
            echo 'GRESKA pri slanju verifikacije: ' . $e->getMessage();
        }
    }

    public function zabeleziAkcijuKorisnika($tipAkcije, $poruka = null)
    {
        return KorisnickaAkcija::zabeleziAkciju($this->korisnik_id, $tipAkcije, $poruka);
    }
}
