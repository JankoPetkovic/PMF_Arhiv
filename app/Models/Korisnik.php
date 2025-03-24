<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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


    public static function isVerifikovan()
    {
        $verifikovan = $this->verifikovan;

         /**
             * Vraca razliku u godinama izmedju trenutnog datuma i datuma verifikacije ako je razlika manja od 1
             * U suprotnom vraca false
             */
        if($verifikovan){
            $datum_verifikacije= new DateTime($this-> datum_verifikacije);
            $sad = new DateTime();

           
            return $datum_verifikacije->diff($sad)->y <1;

        }
        return false; 

    }
}
