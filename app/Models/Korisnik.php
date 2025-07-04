<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use App\Mail\Verifikacija;

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

    /**
     * Vraca sve departmane iz tabele Departmani
     */
    public static function getKorisnikInfo()
    {
        return self::all();
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


    public function verifikuj(){
        $link = URL::temporarySignedRoute(
            'verifikuj.mejl',
            Carbon::now()->addMinutes(10),
            ['id' => $this->korisnik_id]
        );
        try {
            Mail::to($this->email)->send(new Verifikacija($this->email, $link));
        } catch (\Exception $e) {
            echo 'GRESKA pri slanju verifikacije: ' . $e->getMessage();
        }
    }
}
