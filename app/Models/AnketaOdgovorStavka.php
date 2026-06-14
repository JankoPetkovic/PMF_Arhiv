<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnketaOdgovorStavka extends Model
{
    protected $table = 'anketa_odgovor_stavka';
    protected $primaryKey = 'stavka_id';
    public $timestamps = false;

    protected $fillable = ['odgovor_id', 'pitanje_id', 'opcija_id', 'slobodan_tekst'];

    public function odgovor()
    {
        return $this->belongsTo(AnketaOdgovor::class, 'odgovor_id', 'odgovor_id');
    }

    public function pitanje()
    {
        return $this->belongsTo(AnketaPitanje::class, 'pitanje_id', 'pitanje_id');
    }

    public function opcija()
    {
        return $this->belongsTo(AnketaOpcija::class, 'opcija_id', 'opcija_id');
    }
}
