<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NivoStudija extends Model
{
    use HasFactory;

    protected $table = 'nivo_studija';

    protected $primaryKey = 'nivo_studija_id';

    public $timestamps = false;

    protected $fillable = ['nivo_studija'];

    public function smerovi(): HasMany
    {
        return $this->hasMany(Smer::class, 'nivo_studija_id', 'nivo_studija_id');
    }
}
