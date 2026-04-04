<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Kompanije ──────────────────────────────────────────────
        $fonisId = DB::table('kompanije')->insertGetId([
            'naziv'      => 'Fonis d.o.o.',
            'pib'        => '101234567',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $ncdId = DB::table('kompanije')->insertGetId([
            'naziv'      => 'NCD Solutions',
            'pib'        => '102345678',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $deltasId = DB::table('kompanije')->insertGetId([
            'naziv'      => 'Deltas',
            'pib'        => '103456789',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ── Korisnici ──────────────────────────────────────────────
        // Admin
        $admin = User::create([
            'ime'           => 'Admin',
            'prezime'       => 'Panel',
            'email'         => 'admin@fonis.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'admin',
            'kompanija_id'  => $fonisId,
            'brojTelefona'  => '+381641000000',
        ]);

        // Vozači
        $marko = User::create([
            'ime'           => 'Marko',
            'prezime'       => 'Nikolić',
            'email'         => 'marko.nikolic@fonis.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $fonisId,
            'brojTelefona'  => '+381641234567',
        ]);

        $jovan = User::create([
            'ime'           => 'Jovan',
            'prezime'       => 'Petrović',
            'email'         => 'jovan.petrovic@ncd.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $ncdId,
            'brojTelefona'  => '+381652345678',
        ]);

        $ana = User::create([
            'ime'           => 'Ana',
            'prezime'       => 'Đorđević',
            'email'         => 'ana.djordjevic@deltas.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $deltasId,
            'brojTelefona'  => '+381663456789',
        ]);

        $stefan = User::create([
            'ime'           => 'Stefan',
            'prezime'       => 'Mijatović',
            'email'         => 'stefan.mijatovic@fonis.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $fonisId,
            'brojTelefona'  => '+381674567890',
        ]);

        $milica = User::create([
            'ime'           => 'Milica',
            'prezime'       => 'Stanković',
            'email'         => 'milica.stankovic@ncd.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $ncdId,
            'brojTelefona'  => '+381685678901',
        ]);

        $nikola = User::create([
            'ime'           => 'Nikola',
            'prezime'       => 'Vasić',
            'email'         => 'nikola.vasic@deltas.rs',
            'password'      => Hash::make('password'),
            'uloga'         => 'korisnik',
            'kompanija_id'  => $deltasId,
            'brojTelefona'  => '+381696789012',
        ]);

        // ── Voznje ─────────────────────────────────────────────────
        // Marko vozi: Zemun → Beograd centar (sutra ujutru)
        $v1 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Zemun, Beograd',
            'mestoDo'       => 'Trg Republike, Beograd',
            'departure_lat' => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'   => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'   => 9.4,
            'fuel_price_per_liter' => 185,
            'price_per_seat' => 88,
            'datumVreme'    => now()->addDay()->setTime(7, 30),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => true,
            'seats'         => 3,
            'marka'         => 'Volkswagen Golf',
            'boja'          => 'siva',
            'brojTablica'   => 'BG-123-AB',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $marko->id, 'voznja_id' => $v1,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Jovan vozi: Novi Beograd → Savamala (prekosutra)
        $v2 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Novi Beograd, Bulevar Mihajla Pupina',
            'mestoDo'       => 'Savamala, Beograd',
            'departure_lat' => 44.8070, 'departure_lng' => 20.4240,
            'arrival_lat'   => 44.8092, 'arrival_lng'   => 20.4497,
            'distance_km'   => 5.2,
            'fuel_price_per_liter' => 190,
            'price_per_seat' => 62,
            'datumVreme'    => now()->addDays(2)->setTime(8, 0),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => true,
            'seats'         => 2,
            'marka'         => 'Toyota Corolla',
            'boja'          => 'bela',
            'brojTablica'   => 'NS-456-CD',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $jovan->id, 'voznja_id' => $v2,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Ana vozi: Banovo Brdo → Slavija (sutra popodne)
        $v3 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Banovo Brdo, Beograd',
            'mestoDo'       => 'Slavija, Beograd',
            'departure_lat' => 44.7885, 'departure_lng' => 20.4058,
            'arrival_lat'   => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'   => 7.8,
            'fuel_price_per_liter' => 188,
            'price_per_seat' => 73,
            'datumVreme'    => now()->addDay()->setTime(16, 45),
            'smoking'       => false,
            'muzika'        => false,
            'klima'         => true,
            'seats'         => 3,
            'marka'         => 'Škoda Octavia',
            'boja'          => 'plava',
            'brojTablica'   => 'BG-789-EF',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $ana->id, 'voznja_id' => $v3,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Stefan vozi: Voždovac → Terazije (za 3 dana ujutru)
        $v4 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Voždovac, Beograd',
            'mestoDo'       => 'Terazije, Beograd',
            'departure_lat' => 44.7720, 'departure_lng' => 20.4900,
            'arrival_lat'   => 44.8152, 'arrival_lng'   => 20.4620,
            'distance_km'   => 6.3,
            'fuel_price_per_liter' => 185,
            'price_per_seat' => 59,
            'datumVreme'    => now()->addDays(3)->setTime(7, 0),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => true,
            'seats'         => 4,
            'marka'         => 'BMW Serija 3',
            'boja'          => 'crna',
            'brojTablica'   => 'BG-321-GH',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $stefan->id, 'voznja_id' => $v4,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Milica vozi: Čukarica → Palilula (sutra ujutru)
        $v5 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Čukarica, Beograd',
            'mestoDo'       => 'Palilula, Beograd',
            'departure_lat' => 44.7912, 'departure_lng' => 20.3975,
            'arrival_lat'   => 44.8320, 'arrival_lng'   => 20.4820,
            'distance_km'   => 11.2,
            'fuel_price_per_liter' => 192,
            'price_per_seat' => 107,
            'datumVreme'    => now()->addDay()->setTime(8, 15),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => false,
            'seats'         => 2,
            'marka'         => 'Renault Clio',
            'boja'          => 'crvena',
            'brojTablica'   => 'BG-654-IJ',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $milica->id, 'voznja_id' => $v5,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Nikola vozi: Zvezdara → Studentski trg (za 4 dana)
        $v6 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Zvezdara, Beograd',
            'mestoDo'       => 'Studentski trg, Beograd',
            'departure_lat' => 44.8000, 'departure_lng' => 20.5100,
            'arrival_lat'   => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'   => 8.1,
            'fuel_price_per_liter' => 187,
            'price_per_seat' => 76,
            'datumVreme'    => now()->addDays(4)->setTime(9, 0),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => true,
            'seats'         => 3,
            'marka'         => 'Hyundai i30',
            'boja'          => 'srebrna',
            'brojTablica'   => 'BG-987-KL',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $nikola->id, 'voznja_id' => $v6,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Marko vozi još jednu: Zemun → Ada Ciganlija (za 5 dana)
        $v7 = DB::table('voznje')->insertGetId([
            'mestoOd'       => 'Zemun, Beograd',
            'mestoDo'       => 'Ada Ciganlija, Beograd',
            'departure_lat' => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'   => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'   => 13.5,
            'fuel_price_per_liter' => 185,
            'price_per_seat' => 105,
            'datumVreme'    => now()->addDays(5)->setTime(10, 0),
            'smoking'       => false,
            'muzika'        => true,
            'klima'         => true,
            'seats'         => 2,
            'marka'         => 'Volkswagen Golf',
            'boja'          => 'siva',
            'brojTablica'   => 'BG-123-AB',
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);
        DB::table('user_voznja')->insert([
            'user_id' => $marko->id, 'voznja_id' => $v7,
            'uloga' => 'vozac', 'status' => 'confirmed',
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
