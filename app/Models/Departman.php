<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Departman extends Model
{
    use HasFactory;

    protected $table = 'departman';

    protected $primaryKey = 'departman_id';

    public $timestamps = false;

    protected $fillable = ['naziv'];

    public function smerovi(): HasMany
    {
        return $this->hasMany(Smer::class, 'departman_id', 'departman_id');
    }
}
