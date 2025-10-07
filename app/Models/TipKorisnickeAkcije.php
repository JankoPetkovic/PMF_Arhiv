<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipKorisnickeAkcije extends Model
{
   /**
    * Tabela koja predstavlja model.    
   */
    protected $table = 'tip_korisnicke_akcije';

   /** Primarni kljuc u tabeli 
    * 
    * @var string
   */
    protected $primaryKey = 'id';

    /** Iskljucivanje created_at i updated_at kolone
    * @var bool
    */
    public $timestamps = false;

    /** Kolone u koje je dozvoljen upis
    * @var array
    */
    protected $fillable = ['naziv',];

    public function korisnickeAkcije()
    {
        return $this->hasMany(KorisnickaAkcija::class, 'tip_korisnicke_akcije_id');
    }
}
