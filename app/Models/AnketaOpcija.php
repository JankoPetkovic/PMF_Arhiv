<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnketaOpcija extends Model
{
    protected $table = 'anketa_opcija';
    protected $primaryKey = 'opcija_id';
    public $timestamps = false;

    protected $fillable = ['pitanje_id', 'tekst', 'redosled'];

    public function pitanje()
    {
        return $this->belongsTo(AnketaPitanje::class, 'pitanje_id', 'pitanje_id');
    }
}
