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

    public static function prikaziKorisnika($id){
        $korisnik = Korisnik::findOrFail($id);

        $podaciKorisnika = [
            'ime' => $korisnik->ime,
            'prezime' => $korisnik->prezime,
            'broj_indeksa' => $korisnik ->broj_indeksa,
            'korisnicki_email' => $korisnik->email,
            'smerovi_korisnika' => $korisnik->smerovi->map(function ($smer) {
                    return [
                        'smer_id' => $smer->smer_id,
                        'naziv_smera' => $smer->naziv_smera,
                        'nivo_studija' => $smer->nivoStudija->nivo_studija,
                    ];
                })->toArray(),
                'predmeti_korisnika' => $korisnik->predmeti->map(function ($predmet) {
                    return [
                        'predmet_id' => $predmet->predmet_id,
                        'naziv' => $predmet->naziv,
                    ];
                })->toArray(),
            'godina' => $korisnik->godina,
        ];

        $podaci = [
            'korisnik' => $podaciKorisnika,
            'dostupniSmerovi' => Smer::all()->toArray(),
            'dostupniPredmeti' => Predmet::whereIn('smer_id', array_column($podaciKorisnika['smerovi_korisnika'], 'id'))->get()->toArray(),
        ];

        return $podaci;
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

    public function obradiVerifikaciju(){
        $this->datum_verifikacije = Carbon::now();
        $this->save();

        $keširaniMaterijal = Cache::pull('materijal_cekaj_' . $this->korisnik_id);

        if ($keširaniMaterijal) {
            $fajl = new UploadedFile(
                storage_path('app/public/' . $keširaniMaterijal['putanja_fajla']),
                basename($keširaniMaterijal['putanja_fajla'])
            );

            $putanja = Materijal::kreirajMaterijal(
                $fajl,
                $keširaniMaterijal['departman'],
                $keširaniMaterijal['nivoStudija'],
                $keširaniMaterijal['smer'],
                $keširaniMaterijal['godina'],
                $keširaniMaterijal['predmet'],
                $keširaniMaterijal['tipMaterijala'],
                $keširaniMaterijal['podtipMaterijala'],
                $keširaniMaterijal['akademskaGodina'],
                $this->korisnik_id
            );
            Storage::disk('public')->delete($keširaniMaterijal['putanja_fajla']);
        }
    }

    public function zabeleziAkcijuKorisnika($tipAkcije, $poruka = null)
    {
        return KorisnickaAkcija::zabeleziAkciju($this->korisnik_id, $tipAkcije, $poruka);
    }
}
