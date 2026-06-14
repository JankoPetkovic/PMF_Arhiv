<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnketaOdgovor extends Model
{
    protected $table = 'anketa_odgovor';
    protected $primaryKey = 'odgovor_id';
    public $timestamps = false;

    protected $fillable = ['anketa_id', 'korisnik_id', 'ime', 'prezime', 'email', 'broj_indeksa', 'vreme_odgovora'];

    protected $casts = [
        'vreme_odgovora' => 'datetime',
    ];

    public function anketa()
    {
        return $this->belongsTo(Anketa::class, 'anketa_id', 'anketa_id');
    }

    public function stavke()
    {
        return $this->hasMany(AnketaOdgovorStavka::class, 'odgovor_id', 'odgovor_id');
    }
}
