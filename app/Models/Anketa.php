<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class Anketa extends Model
{
    protected $table = 'anketa';
    protected $primaryKey = 'anketa_id';
    public $timestamps = false;

    protected $fillable = ['parlament_objava_id', 'naslov', 'rok_trajanja', 'dozvoli_vise', 'datum_kreiranja'];

    protected $casts = [
        'rok_trajanja' => 'datetime',
        'datum_kreiranja' => 'datetime',
        'dozvoli_vise' => 'boolean',
    ];

    // Da li je trenutno ulogovani korisnik već popunio ovu anketu.
    public function vecPopunioUlogovani(): bool
    {
        if (!Auth::check()) return false;
        $k = Auth::user();
        return $this->odgovori()
            ->where(fn($q) => $q->where('korisnik_id', $k->korisnik_id)->orWhere('email', $k->email))
            ->exists();
    }

    public function objava()
    {
        return $this->belongsTo(ParlamentObjava::class, 'parlament_objava_id', 'parlament_objava_id');
    }

    public function pitanja()
    {
        return $this->hasMany(AnketaPitanje::class, 'anketa_id', 'anketa_id')->orderBy('redosled');
    }

    public function odgovori()
    {
        return $this->hasMany(AnketaOdgovor::class, 'anketa_id', 'anketa_id');
    }

    public function jeIstekla(): bool
    {
        return $this->rok_trajanja && $this->rok_trajanja->isPast();
    }

    public function zaPrikaz(): array
    {
        return [
            'anketa_id'    => $this->anketa_id,
            'naslov'       => $this->naslov,
            'rok_trajanja' => $this->rok_trajanja ? $this->rok_trajanja->toIso8601String() : null,
            'istekla'      => $this->jeIstekla(),
            'dozvoli_vise' => (bool) $this->dozvoli_vise,
            'vec_popunjeno' => $this->vecPopunioUlogovani(),
            'broj_odgovora' => $this->odgovori()->count(),
            'pitanja'      => $this->pitanja->map(fn($p) => $p->zaPrikaz())->values(),
        ];
    }
}
