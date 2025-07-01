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
    protected $fillable = ['email', 'verifikovan', 'datum_verifikacije'];

    protected $casts = [
        'vreme_verifikacije' => 'datetime',
    ];

    /**
     * Vraca sve departmane iz tabele Departmani
     */
    public static function getKorisnikInfo()
    {
        return self::all();
    }

    /**
     * Ako je korisnik verifikovan i zadnji put je verifikovan pre vise od godinu dana, verifikovan se postavlja na false i mora da se ponovo verifikuje.
     * 
     * @var bool
     */
    public function isVerifikovan()
    {
        $verifikovan = $this->verifikovan;
        if($verifikovan){
            $datum_verifikacije= new DateTime($this-> datum_verifikacije);
            $sad = new DateTime();
            $razlika = $datum_verifikacije->diff($sad)->y >=1;
            
            if($razlika)
            {
                $this->verifikovan = 0;
                $this->save();
                return false;
            }
            return true;
        }
        return false; 
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
