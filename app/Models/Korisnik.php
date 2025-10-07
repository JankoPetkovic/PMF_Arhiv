<?php

namespace App\Models;

use App\Mail\Verifikacija;

use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

use App\Models\KorisnickaAkcija;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\HomeController;

class Korisnik extends Model
{
    /**
     * Tabela koja predstavalja model
     * 
     * @var string
     */
    protected $table = 'korisnik';

    /**
     * Primarni kljuc u tabeli
     * 
     * @var string
     */
    protected $primaryKey = 'korisnik_id';


    /**
     * Iskljucivanje created_at i updated_at kolone
     * 
     * @var bool
     */
    public $timestamps = false;

    /**
     * Kolone u koje je dozvoljen upis
     */
    protected $fillable = ['email', 'datum_verifikacije'];

    protected $casts = [
        'datum_verifikacije' => 'datetime',
    ];

    public function korisnickeAkcije()
    {
        return $this->hasMany(KorisnickaAkcija::class, 'korisnik_id');
    }

    /**
     * Ako je korisnik verifikovan i zadnji put je verifikovan pre vise od mesec dana, verifikovan se postavlja na false i mora da se ponovo verifikuje.
     * 
     * @var bool
     */
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
                $id
            );
            Storage::disk('public')->delete($keširaniMaterijal['putanja_fajla']);
        }
    }

    public function zabeleziAkcijuKorisnika($tipAkcije, $poruka = null)
    {
        return KorisnickaAkcija::zabeleziAkciju($this->korisnik_id, $tipAkcije, $poruka);
    }
}
