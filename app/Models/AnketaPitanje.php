<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnketaPitanje extends Model
{
    protected $table = 'anketa_pitanje';
    protected $primaryKey = 'pitanje_id';
    public $timestamps = false;

    protected $fillable = ['anketa_id', 'tekst', 'tip', 'dozvoli_drugo', 'obavezno', 'redosled'];

    protected $casts = [
        'dozvoli_drugo' => 'boolean',
        'obavezno' => 'boolean',
    ];

    public function anketa()
    {
        return $this->belongsTo(Anketa::class, 'anketa_id', 'anketa_id');
    }

    public function opcije()
    {
        return $this->hasMany(AnketaOpcija::class, 'pitanje_id', 'pitanje_id')->orderBy('redosled');
    }

    public function zaPrikaz(): array
    {
        return [
            'pitanje_id'    => $this->pitanje_id,
            'tekst'         => $this->tekst,
            'tip'           => $this->tip,
            'dozvoli_drugo' => $this->dozvoli_drugo,
            'obavezno'      => $this->obavezno,
            'opcije'        => $this->opcije->map(fn($o) => [
                'opcija_id' => $o->opcija_id,
                'tekst'     => $o->tekst,
            ])->values(),
        ];
    }
}
