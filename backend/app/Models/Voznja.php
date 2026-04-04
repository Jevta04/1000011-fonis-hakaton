<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voznja extends Model
{
    use HasFactory;
    protected $table='voznje';
    protected $fillable = [
        'mestoOd',
        'mestoDo',
        'datumVreme',
        'smoking'
    ];

    protected $casts = [
        'datumVreme'=>'datetime',
        'smoking'=>'boolean'
    ];


    public function users(){
        return $this->belongsToMany(User::class,'user_voznja')
                    ->withPivot('uloga')
                    ->withTimestamps();
    }

    public function vozac()
    {
        return $this->belongsToMany(User::class, 'user_voznja')
                    ->wherePivot('uloga', 'vozac');
    }

    public function putnici()
    {
        return $this->belongsToMany(User::class, 'user_voznja')
                    ->wherePivot('uloga', 'putnik');
    }
}
