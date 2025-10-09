<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipKorisnickeAkcije extends Model
{
    protected $table = 'tip_korisnicke_akcije';

    protected $primaryKey = 'id';

    public $timestamps = false;
    
    protected $fillable = ['naziv',];

    public function korisnickeAkcije()
    {
        return $this->hasMany(KorisnickaAkcija::class, 'tip_korisnicke_akcije_id');
    }
}
