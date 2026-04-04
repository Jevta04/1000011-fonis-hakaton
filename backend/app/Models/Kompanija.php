<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kompanija extends Model
{
    use HasFactory;
    protected $table='kompanije';
    protected $fillable = [
        'naziv',
        'pib'
    ];

    public function users(){
        return $this->hasMany(User::class);
    }
}
