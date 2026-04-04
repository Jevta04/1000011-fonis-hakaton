<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voznja extends Model
{
    use HasFactory;

    protected $table = 'voznje';

    protected $fillable = [
        'mestoOd', 'mestoDo',
        'departure_lat', 'departure_lng',
        'arrival_lat', 'arrival_lng',
        'distance_km',
        'fuel_price_per_liter',
        'price_per_seat',
        'datumVreme',
        'smoking', 'muzika', 'klima',
        'seats',
        'brojTablica', 'marka', 'boja',
    ];

    protected $casts = [
        'datumVreme'           => 'datetime',
        'smoking'              => 'boolean',
        'muzika'               => 'boolean',
        'klima'                => 'boolean',
        'seats'                => 'integer',
        'departure_lat'        => 'float',
        'departure_lng'        => 'float',
        'arrival_lat'          => 'float',
        'arrival_lng'          => 'float',
        'distance_km'          => 'float',
        'fuel_price_per_liter' => 'float',
        'price_per_seat'       => 'float',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_voznja', 'voznja_id', 'user_id')
                    ->withPivot('uloga', 'status')
                    ->withTimestamps();
    }

    public function vozac()
    {
        return $this->belongsToMany(User::class, 'user_voznja', 'voznja_id', 'user_id')
                    ->withPivot('uloga', 'status')
                    ->wherePivot('uloga', 'vozac');
    }

    public function putnici()
    {
        return $this->belongsToMany(User::class, 'user_voznja', 'voznja_id', 'user_id')
                    ->withPivot('uloga', 'status')
                    ->wherePivot('uloga', 'putnik');
    }
}
