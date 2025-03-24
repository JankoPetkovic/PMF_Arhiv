<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

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

    public function verifikuj()
{
    $token = Str::random(60);

    DB::table('verifikacija_tokeni')->insert([
        'korisnik_id' => $this->korisnik_id,
        'token' => $token,
        'created_at' => now(),
    ]);

    Mail::to($this->email)->send(new VerifikacijaKorisnika($this, $token));
}
}
