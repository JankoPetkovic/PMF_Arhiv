<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use HasFactory;

class Departman extends Model
{
    protected $table = 'departman';

    protected $primaryKey = 'departman_id';

    public $timestamps = false;

    protected $fillable = ['naziv'];

    public function smerovi(): HasMany
    {
        return $this->hasMany(Smer::class, 'departman_id', 'departman_id');
    }
}
