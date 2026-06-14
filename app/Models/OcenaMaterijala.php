<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OcenaMaterijala extends Model
{
    protected $table = 'ocena_materijala';
    protected $primaryKey = 'ocena_id';
    public $timestamps = false;

    protected $fillable = ['materijal_id', 'korisnik_id', 'ocena', 'datum'];

    public function materijal()
    {
        return $this->belongsTo(Materijal::class, 'materijal_id', 'materijal_id');
    }

    public function korisnik()
    {
        return $this->belongsTo(Korisnik::class, 'korisnik_id', 'korisnik_id');
    }
}
