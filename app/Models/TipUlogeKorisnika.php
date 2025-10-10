<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipUlogeKorisnika extends Model
{
    protected $table = 'tip_uloge_korisnika';
    protected $primaryKey = 'id'; 

    public $timestamps = false; 

    protected $fillable = [
        'naziv',
    ];

    public function korisnici(){
        return $this->hasMany(Korisnik::class, 'tip_uloge_id', 'id');
    }
}
