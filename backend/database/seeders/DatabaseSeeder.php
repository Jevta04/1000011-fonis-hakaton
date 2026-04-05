<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Truncate all tables ─────────────────────────────────────
        DB::statement('TRUNCATE user_voznja, personal_access_tokens, voznje, vozila, users, kompanije RESTART IDENTITY CASCADE');

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
            'naziv'      => 'Deltas Commerce',
            'pib'        => '103456789',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $infostudId = DB::table('kompanije')->insertGetId([
            'naziv'      => 'Infostud Group',
            'pib'        => '104567890',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ── Korisnici ──────────────────────────────────────────────
        $admin = DB::table('users')->insertGetId([
            'ime'          => 'Admin',
            'prezime'      => 'Panel',
            'email'        => 'admin@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'admin',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381641000000',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $marko = DB::table('users')->insertGetId([
            'ime'          => 'Marko',
            'prezime'      => 'Nikolić',
            'email'        => 'marko.nikolic@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381641234567',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $jovan = DB::table('users')->insertGetId([
            'ime'          => 'Jovan',
            'prezime'      => 'Petrović',
            'email'        => 'jovan.petrovic@ncd.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $ncdId,
            'brojTelefona' => '+381652345678',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $ana = DB::table('users')->insertGetId([
            'ime'          => 'Ana',
            'prezime'      => 'Đorđević',
            'email'        => 'ana.djordjevic@deltas.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $deltasId,
            'brojTelefona' => '+381663456789',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $stefan = DB::table('users')->insertGetId([
            'ime'          => 'Stefan',
            'prezime'      => 'Mijatović',
            'email'        => 'stefan.mijatovic@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381674567890',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $milica = DB::table('users')->insertGetId([
            'ime'          => 'Milica',
            'prezime'      => 'Stanković',
            'email'        => 'milica.stankovic@ncd.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $ncdId,
            'brojTelefona' => '+381685678901',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $nikola = DB::table('users')->insertGetId([
            'ime'          => 'Nikola',
            'prezime'      => 'Vasić',
            'email'        => 'nikola.vasic@deltas.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $deltasId,
            'brojTelefona' => '+381696789012',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $maja = DB::table('users')->insertGetId([
            'ime'          => 'Maja',
            'prezime'      => 'Lazović',
            'email'        => 'maja.lazovic@infostud.com',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $infostudId,
            'brojTelefona' => '+381631234567',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $luka = DB::table('users')->insertGetId([
            'ime'          => 'Luka',
            'prezime'      => 'Popović',
            'email'        => 'luka.popovic@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381642345678',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $sara = DB::table('users')->insertGetId([
            'ime'          => 'Sara',
            'prezime'      => 'Jović',
            'email'        => 'sara.jovic@ncd.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $ncdId,
            'brojTelefona' => '+381653456789',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $aleksandar = DB::table('users')->insertGetId([
            'ime'          => 'Aleksandar',
            'prezime'      => 'Radić',
            'email'        => 'aleksandar.radic@deltas.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $deltasId,
            'brojTelefona' => '+381664567890',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $teodora = DB::table('users')->insertGetId([
            'ime'          => 'Teodora',
            'prezime'      => 'Vuković',
            'email'        => 'teodora.vukovic@infostud.com',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $infostudId,
            'brojTelefona' => '+381675678901',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $nemanja = DB::table('users')->insertGetId([
            'ime'          => 'Nemanja',
            'prezime'      => 'Stojanović',
            'email'        => 'nemanja.stojanovic@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381686789012',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $katarina = DB::table('users')->insertGetId([
            'ime'          => 'Katarina',
            'prezime'      => 'Ilić',
            'email'        => 'katarina.ilic@ncd.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $ncdId,
            'brojTelefona' => '+381697890123',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $vladimir = DB::table('users')->insertGetId([
            'ime'          => 'Vladimir',
            'prezime'      => 'Krstić',
            'email'        => 'vladimir.krstic@deltas.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $deltasId,
            'brojTelefona' => '+381638901234',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $jelena = DB::table('users')->insertGetId([
            'ime'          => 'Jelena',
            'prezime'      => 'Maksimović',
            'email'        => 'jelena.maksimovic@infostud.com',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $infostudId,
            'brojTelefona' => '+381649012345',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $dusan = DB::table('users')->insertGetId([
            'ime'          => 'Dušan',
            'prezime'      => 'Pavlović',
            'email'        => 'dusan.pavlovic@fonis.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $fonisId,
            'brojTelefona' => '+381650123456',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $ivana = DB::table('users')->insertGetId([
            'ime'          => 'Ivana',
            'prezime'      => 'Bogdanović',
            'email'        => 'ivana.bogdanovic@ncd.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $ncdId,
            'brojTelefona' => '+381661234567',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $filip = DB::table('users')->insertGetId([
            'ime'          => 'Filip',
            'prezime'      => 'Andrić',
            'email'        => 'filip.andric@deltas.rs',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $deltasId,
            'brojTelefona' => '+381672345678',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $andrea = DB::table('users')->insertGetId([
            'ime'          => 'Andrea',
            'prezime'      => 'Petrović',
            'email'        => 'andrea.petrovic@infostud.com',
            'password'     => Hash::make('password'),
            'uloga'        => 'korisnik',
            'kompanija_id' => $infostudId,
            'brojTelefona' => '+381683456789',
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        // ── Vozila ────────────────────────────────────────────────
        DB::table('vozila')->insert([
            ['user_id' => $marko,      'marka' => 'Volkswagen Golf',  'boja' => 'siva',   'brojTablica' => 'BG-123-AB', 'fuel_consumption_per_100km' => 6.5, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jovan,      'marka' => 'Toyota Corolla',   'boja' => 'bela',   'brojTablica' => 'NS-456-CD', 'fuel_consumption_per_100km' => 7.2, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ana,        'marka' => 'Škoda Octavia',    'boja' => 'crna',   'brojTablica' => 'BG-789-EF', 'fuel_consumption_per_100km' => 5.8, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $stefan,     'marka' => 'Renault Megane',   'boja' => 'plava',  'brojTablica' => 'BG-321-GH', 'fuel_consumption_per_100km' => 6.0, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $nikola,     'marka' => 'BMW Serija 3',     'boja' => 'crna',   'brojTablica' => 'NS-654-IJ', 'fuel_consumption_per_100km' => 8.1, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $luka,       'marka' => 'Opel Astra',       'boja' => 'crvena', 'brojTablica' => 'BG-987-KL', 'fuel_consumption_per_100km' => 7.0, 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $aleksandar, 'marka' => 'Ford Focus',       'boja' => 'siva',   'brojTablica' => 'KG-111-MN', 'fuel_consumption_per_100km' => 6.8, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Voznje — PROŠLIH 7 DANA (~15 rides) ────────────────────

        // Dan -7: Marko, Zemun → Trg Republike
        $p1 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Trg Republike, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'          => 9.4,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 88,
            'datumVreme'           => Carbon::now()->subDays(7)->setTime(7, 30),
            'smoking' => false, 'muzika' => true,  'klima' => true,
            'seats'   => 0,
            'marka' => 'Volkswagen Golf', 'boja' => 'siva', 'brojTablica' => 'BG-123-AB',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $marko, 'voznja_id' => $p1, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jovan, 'voznja_id' => $p1, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ana,   'voznja_id' => $p1, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -7: Jovan, Novi Beograd → Savamala
        $p2 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Novi Beograd, Bulevar Mihajla Pupina',
            'mestoDo'              => 'Savamala, Beograd',
            'departure_lat'        => 44.8070, 'departure_lng' => 20.4240,
            'arrival_lat'          => 44.8092, 'arrival_lng'   => 20.4497,
            'distance_km'          => 5.2,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 62,
            'datumVreme'           => Carbon::now()->subDays(7)->setTime(8, 0),
            'smoking' => false, 'muzika' => true,  'klima' => true,
            'seats'   => 1,
            'marka' => 'Toyota Corolla', 'boja' => 'bela', 'brojTablica' => 'NS-456-CD',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jovan,  'voznja_id' => $p2, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $stefan, 'voznja_id' => $p2, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -6: Ana, Banovo Brdo → Slavija
        $p3 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Banovo Brdo, Beograd',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.7885, 'departure_lng' => 20.4058,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 7.8,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 73,
            'datumVreme'           => Carbon::now()->subDays(6)->setTime(16, 45),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Škoda Octavia', 'boja' => 'plava', 'brojTablica' => 'BG-789-EF',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $ana,    'voznja_id' => $p3, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $milica, 'voznja_id' => $p3, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -6: Stefan, Voždovac → Terazije
        $p4 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Voždovac, Beograd',
            'mestoDo'              => 'Terazije, Beograd',
            'departure_lat'        => 44.7720, 'departure_lng' => 20.4900,
            'arrival_lat'          => 44.8152, 'arrival_lng'   => 20.4620,
            'distance_km'          => 6.3,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 59,
            'datumVreme'           => Carbon::now()->subDays(6)->setTime(7, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'BMW Serija 3', 'boja' => 'crna', 'brojTablica' => 'BG-321-GH',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $stefan, 'voznja_id' => $p4, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $luka,   'voznja_id' => $p4, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -5: Milica, Čukarica → Palilula
        $p5 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Čukarica, Beograd',
            'mestoDo'              => 'Palilula, Beograd',
            'departure_lat'        => 44.7912, 'departure_lng' => 20.3975,
            'arrival_lat'          => 44.8320, 'arrival_lng'   => 20.4820,
            'distance_km'          => 11.2,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 107,
            'datumVreme'           => Carbon::now()->subDays(5)->setTime(8, 15),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 0,
            'marka' => 'Renault Clio', 'boja' => 'crvena', 'brojTablica' => 'BG-654-IJ',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $milica,     'voznja_id' => $p5, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $nikola,     'voznja_id' => $p5, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $sara,       'voznja_id' => $p5, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -5: Nikola, Zvezdara → Studentski trg
        $p6 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zvezdara, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.8000, 'departure_lng' => 20.5100,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 8.1,
            'fuel_price_per_liter' => 187,
            'price_per_seat'       => 76,
            'datumVreme'           => Carbon::now()->subDays(5)->setTime(9, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Hyundai i30', 'boja' => 'srebrna', 'brojTablica' => 'BG-987-KL',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nikola,     'voznja_id' => $p6, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $aleksandar, 'voznja_id' => $p6, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -4: Maja, Bežanijska kosa → Vukov Spomenik
        $p7 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Bežanijska kosa, Beograd',
            'mestoDo'              => 'Vukov Spomenik, Beograd',
            'departure_lat'        => 44.8050, 'departure_lng' => 20.3780,
            'arrival_lat'          => 44.8025, 'arrival_lng'   => 20.4747,
            'distance_km'          => 10.3,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 130,
            'datumVreme'           => Carbon::now()->subDays(4)->setTime(7, 45),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Opel Astra', 'boja' => 'bela', 'brojTablica' => 'BG-111-MA',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $maja,    'voznja_id' => $p7, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $teodora, 'voznja_id' => $p7, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -4: Luka, Mirijevo → Ada Ciganlija
        $p8 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Mirijevo, Beograd',
            'mestoDo'              => 'Ada Ciganlija, Beograd',
            'departure_lat'        => 44.7900, 'departure_lng' => 20.5300,
            'arrival_lat'          => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'          => 14.2,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 133,
            'datumVreme'           => Carbon::now()->subDays(4)->setTime(17, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Ford Focus', 'boja' => 'plava', 'brojTablica' => 'BG-222-LP',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $luka,   'voznja_id' => $p8, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $katarina,'voznja_id' => $p8, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -3: Sara, Zemun → Ada Ciganlija
        $p9 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Ada Ciganlija, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'          => 13.5,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 105,
            'datumVreme'           => Carbon::now()->subDays(3)->setTime(8, 30),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Peugeot 308', 'boja' => 'siva', 'brojTablica' => 'BG-333-SJ',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $sara,     'voznja_id' => $p9, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $vladimir, 'voznja_id' => $p9, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -3: Aleksandar, Rakovica → Dorćol
        $p10 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Rakovica, Beograd',
            'mestoDo'              => 'Dorćol, Beograd',
            'departure_lat'        => 44.7630, 'departure_lng' => 20.4380,
            'arrival_lat'          => 44.8270, 'arrival_lng'   => 20.4660,
            'distance_km'          => 9.1,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 116,
            'datumVreme'           => Carbon::now()->subDays(3)->setTime(7, 15),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 0,
            'marka' => 'Seat Leon', 'boja' => 'crna', 'brojTablica' => 'BG-444-AR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $aleksandar, 'voznja_id' => $p10, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jelena,     'voznja_id' => $p10, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $dusan,      'voznja_id' => $p10, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -2: Teodora, Konjarnik → Novi Beograd
        $p11 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Konjarnik, Beograd',
            'mestoDo'              => 'Novi Beograd, Ušće',
            'departure_lat'        => 44.7870, 'departure_lng' => 20.4980,
            'arrival_lat'          => 44.8168, 'arrival_lng'   => 20.4277,
            'distance_km'          => 8.9,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 113,
            'datumVreme'           => Carbon::now()->subDays(2)->setTime(8, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Nissan Qashqai', 'boja' => 'srebrna', 'brojTablica' => 'BG-555-TV',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $teodora, 'voznja_id' => $p11, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ivana,   'voznja_id' => $p11, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -2: Nemanja, Sremčica → Trg Nikole Pašića
        $p12 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Sremčica, Beograd',
            'mestoDo'              => 'Trg Nikole Pašića, Beograd',
            'departure_lat'        => 44.7312, 'departure_lng' => 20.3920,
            'arrival_lat'          => 44.8147, 'arrival_lng'   => 20.4621,
            'distance_km'          => 12.4,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 115,
            'datumVreme'           => Carbon::now()->subDays(2)->setTime(7, 45),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 0,
            'marka' => 'Volkswagen Passat', 'boja' => 'siva', 'brojTablica' => 'BG-666-NS',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nemanja, 'voznja_id' => $p12, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $filip,   'voznja_id' => $p12, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $andrea,  'voznja_id' => $p12, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -1: Katarina, Grocka → Slavija
        $p13 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Grocka, Beograd',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.6710, 'departure_lng' => 20.7070,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 28.6,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 183,
            'datumVreme'           => Carbon::now()->subDays(1)->setTime(6, 30),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 1,
            'marka' => 'Honda Civic', 'boja' => 'crvena', 'brojTablica' => 'BG-777-KI',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $katarina, 'voznja_id' => $p13, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $marko,    'voznja_id' => $p13, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -1: Vladimir, Karaburma → Novi Beograd
        $p14 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Karaburma, Beograd',
            'mestoDo'              => 'Novi Beograd, Arene',
            'departure_lat'        => 44.8390, 'departure_lng' => 20.4830,
            'arrival_lat'          => 44.7990, 'arrival_lng'   => 20.4065,
            'distance_km'          => 10.7,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 100,
            'datumVreme'           => Carbon::now()->subDays(1)->setTime(17, 30),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 1,
            'marka' => 'Kia Ceed', 'boja' => 'bela', 'brojTablica' => 'BG-888-VK',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $vladimir, 'voznja_id' => $p14, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jovan,    'voznja_id' => $p14, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Dan -1: Jelena, Zemun → Studentski trg
        $p15 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 10.1,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 96,
            'datumVreme'           => Carbon::now()->subDays(1)->setTime(8, 15),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 0,
            'marka' => 'Mazda 3', 'boja' => 'crna', 'brojTablica' => 'BG-999-JM',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jelena, 'voznja_id' => $p15, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $sara,   'voznja_id' => $p15, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $luka,   'voznja_id' => $p15, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── Voznje — BUDUĆIH 14 DANA (~35 rides) ───────────────────

        // +1 dan
        $f1 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Trg Republike, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'          => 9.4,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 88,
            'datumVreme'           => Carbon::now()->addDays(1)->setTime(7, 30),
            'smoking' => false, 'muzika' => true,  'klima' => true,
            'seats'   => 2,
            'marka' => 'Volkswagen Golf', 'boja' => 'siva', 'brojTablica' => 'BG-123-AB',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $marko, 'voznja_id' => $f1, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $stefan,'voznja_id' => $f1, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f2 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Banovo Brdo, Beograd',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.7885, 'departure_lng' => 20.4058,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 7.8,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 73,
            'datumVreme'           => Carbon::now()->addDays(1)->setTime(8, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Škoda Octavia', 'boja' => 'plava', 'brojTablica' => 'BG-789-EF',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $ana, 'voznja_id' => $f2, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f3 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Čukarica, Beograd',
            'mestoDo'              => 'Palilula, Beograd',
            'departure_lat'        => 44.7912, 'departure_lng' => 20.3975,
            'arrival_lat'          => 44.8320, 'arrival_lng'   => 20.4820,
            'distance_km'          => 11.2,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 107,
            'datumVreme'           => Carbon::now()->addDays(1)->setTime(16, 30),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 1,
            'marka' => 'Renault Clio', 'boja' => 'crvena', 'brojTablica' => 'BG-654-IJ',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $milica, 'voznja_id' => $f3, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jovan,  'voznja_id' => $f3, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        // +2 dana
        $f4 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Novi Beograd, Bulevar Mihajla Pupina',
            'mestoDo'              => 'Savamala, Beograd',
            'departure_lat'        => 44.8070, 'departure_lng' => 20.4240,
            'arrival_lat'          => 44.8092, 'arrival_lng'   => 20.4497,
            'distance_km'          => 5.2,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 62,
            'datumVreme'           => Carbon::now()->addDays(2)->setTime(8, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Toyota Corolla', 'boja' => 'bela', 'brojTablica' => 'NS-456-CD',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jovan, 'voznja_id' => $f4, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ana,   'voznja_id' => $f4, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f5 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zvezdara, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.8000, 'departure_lng' => 20.5100,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 8.1,
            'fuel_price_per_liter' => 187,
            'price_per_seat'       => 76,
            'datumVreme'           => Carbon::now()->addDays(2)->setTime(9, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Hyundai i30', 'boja' => 'srebrna', 'brojTablica' => 'BG-987-KL',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nikola, 'voznja_id' => $f5, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $katarina,'voznja_id' => $f5, 'uloga' => 'putnik', 'status' => 'pending',  'created_at' => now(), 'updated_at' => now()],
        ]);

        // +3 dana
        $f6 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Voždovac, Beograd',
            'mestoDo'              => 'Terazije, Beograd',
            'departure_lat'        => 44.7720, 'departure_lng' => 20.4900,
            'arrival_lat'          => 44.8152, 'arrival_lng'   => 20.4620,
            'distance_km'          => 6.3,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 59,
            'datumVreme'           => Carbon::now()->addDays(3)->setTime(7, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'BMW Serija 3', 'boja' => 'crna', 'brojTablica' => 'BG-321-GH',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $stefan, 'voznja_id' => $f6, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f7 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Bežanijska kosa, Beograd',
            'mestoDo'              => 'Vukov Spomenik, Beograd',
            'departure_lat'        => 44.8050, 'departure_lng' => 20.3780,
            'arrival_lat'          => 44.8025, 'arrival_lng'   => 20.4747,
            'distance_km'          => 10.3,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 130,
            'datumVreme'           => Carbon::now()->addDays(3)->setTime(17, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Opel Astra', 'boja' => 'bela', 'brojTablica' => 'BG-111-MA',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $maja,  'voznja_id' => $f7, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $dusan, 'voznja_id' => $f7, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +4 dana
        $f8 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Mirijevo, Beograd',
            'mestoDo'              => 'Ada Ciganlija, Beograd',
            'departure_lat'        => 44.7900, 'departure_lng' => 20.5300,
            'arrival_lat'          => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'          => 14.2,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 133,
            'datumVreme'           => Carbon::now()->addDays(4)->setTime(8, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Ford Focus', 'boja' => 'plava', 'brojTablica' => 'BG-222-LP',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $luka, 'voznja_id' => $f8, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f9 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Rakovica, Beograd',
            'mestoDo'              => 'Dorćol, Beograd',
            'departure_lat'        => 44.7630, 'departure_lng' => 20.4380,
            'arrival_lat'          => 44.8270, 'arrival_lng'   => 20.4660,
            'distance_km'          => 9.1,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 116,
            'datumVreme'           => Carbon::now()->addDays(4)->setTime(7, 15),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 2,
            'marka' => 'Seat Leon', 'boja' => 'crna', 'brojTablica' => 'BG-444-AR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $aleksandar, 'voznja_id' => $f9, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $sara,       'voznja_id' => $f9, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +5 dana
        $f10 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Ada Ciganlija, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'          => 13.5,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 105,
            'datumVreme'           => Carbon::now()->addDays(5)->setTime(10, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Volkswagen Golf', 'boja' => 'siva', 'brojTablica' => 'BG-123-AB',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $marko, 'voznja_id' => $f10, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $nikola,'voznja_id' => $f10, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        $f11 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Konjarnik, Beograd',
            'mestoDo'              => 'Novi Beograd, Ušće',
            'departure_lat'        => 44.7870, 'departure_lng' => 20.4980,
            'arrival_lat'          => 44.8168, 'arrival_lng'   => 20.4277,
            'distance_km'          => 8.9,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 113,
            'datumVreme'           => Carbon::now()->addDays(5)->setTime(8, 30),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Nissan Qashqai', 'boja' => 'srebrna', 'brojTablica' => 'BG-555-TV',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $teodora, 'voznja_id' => $f11, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +6 dana
        $f12 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Sremčica, Beograd',
            'mestoDo'              => 'Trg Nikole Pašića, Beograd',
            'departure_lat'        => 44.7312, 'departure_lng' => 20.3920,
            'arrival_lat'          => 44.8147, 'arrival_lng'   => 20.4621,
            'distance_km'          => 12.4,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 115,
            'datumVreme'           => Carbon::now()->addDays(6)->setTime(7, 45),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Volkswagen Passat', 'boja' => 'siva', 'brojTablica' => 'BG-666-NS',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nemanja, 'voznja_id' => $f12, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ivana,   'voznja_id' => $f12, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f13 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Karaburma, Beograd',
            'mestoDo'              => 'Novi Beograd, Arene',
            'departure_lat'        => 44.8390, 'departure_lng' => 20.4830,
            'arrival_lat'          => 44.7990, 'arrival_lng'   => 20.4065,
            'distance_km'          => 10.7,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 100,
            'datumVreme'           => Carbon::now()->addDays(6)->setTime(17, 30),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 2,
            'marka' => 'Kia Ceed', 'boja' => 'bela', 'brojTablica' => 'BG-888-VK',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $vladimir, 'voznja_id' => $f13, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $filip,    'voznja_id' => $f13, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        // +7 dana
        $f14 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Grocka, Beograd',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.6710, 'departure_lng' => 20.7070,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 28.6,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 183,
            'datumVreme'           => Carbon::now()->addDays(7)->setTime(6, 30),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Honda Civic', 'boja' => 'crvena', 'brojTablica' => 'BG-777-KI',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $katarina, 'voznja_id' => $f14, 'uloga' => 'vozac',   'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $andrea,   'voznja_id' => $f14, 'uloga' => 'putnik',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f15 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 10.1,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 96,
            'datumVreme'           => Carbon::now()->addDays(7)->setTime(8, 15),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Mazda 3', 'boja' => 'crna', 'brojTablica' => 'BG-999-JM',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jelena, 'voznja_id' => $f15, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +8 dana
        $f16 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Novi Beograd, Bulevar Mihajla Pupina',
            'mestoDo'              => 'Palilula, Beograd',
            'departure_lat'        => 44.8070, 'departure_lng' => 20.4240,
            'arrival_lat'          => 44.8320, 'arrival_lng'   => 20.4820,
            'distance_km'          => 8.3,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 79,
            'datumVreme'           => Carbon::now()->addDays(8)->setTime(7, 30),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Toyota Corolla', 'boja' => 'bela', 'brojTablica' => 'NS-456-CD',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jovan, 'voznja_id' => $f16, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $maja,  'voznja_id' => $f16, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        $f17 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Bežanijska kosa, Beograd',
            'mestoDo'              => 'Terazije, Beograd',
            'departure_lat'        => 44.8050, 'departure_lng' => 20.3780,
            'arrival_lat'          => 44.8152, 'arrival_lng'   => 20.4620,
            'distance_km'          => 9.8,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 92,
            'datumVreme'           => Carbon::now()->addDays(8)->setTime(8, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Opel Astra', 'boja' => 'bela', 'brojTablica' => 'BG-111-MA',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $maja, 'voznja_id' => $f17, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +9 dana
        $f18 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Voždovac, Beograd',
            'mestoDo'              => 'Savamala, Beograd',
            'departure_lat'        => 44.7720, 'departure_lng' => 20.4900,
            'arrival_lat'          => 44.8092, 'arrival_lng'   => 20.4497,
            'distance_km'          => 7.1,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 66,
            'datumVreme'           => Carbon::now()->addDays(9)->setTime(8, 30),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 2,
            'marka' => 'BMW Serija 3', 'boja' => 'crna', 'brojTablica' => 'BG-321-GH',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $stefan,  'voznja_id' => $f18, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $nemanja, 'voznja_id' => $f18, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f19 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zvezdara, Beograd',
            'mestoDo'              => 'Dorćol, Beograd',
            'departure_lat'        => 44.8000, 'departure_lng' => 20.5100,
            'arrival_lat'          => 44.8270, 'arrival_lng'   => 20.4660,
            'distance_km'          => 7.3,
            'fuel_price_per_liter' => 187,
            'price_per_seat'       => 68,
            'datumVreme'           => Carbon::now()->addDays(9)->setTime(17, 15),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Hyundai i30', 'boja' => 'srebrna', 'brojTablica' => 'BG-987-KL',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nikola, 'voznja_id' => $f19, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +10 dana
        $f20 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Mirijevo, Beograd',
            'mestoDo'              => 'Trg Republike, Beograd',
            'departure_lat'        => 44.7900, 'departure_lng' => 20.5300,
            'arrival_lat'          => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'          => 12.8,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 120,
            'datumVreme'           => Carbon::now()->addDays(10)->setTime(7, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Ford Focus', 'boja' => 'plava', 'brojTablica' => 'BG-222-LP',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $luka,  'voznja_id' => $f20, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $dusan, 'voznja_id' => $f20, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f21 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Palilula, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8320, 'arrival_lng'   => 20.4820,
            'distance_km'          => 11.0,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 104,
            'datumVreme'           => Carbon::now()->addDays(10)->setTime(8, 45),
            'smoking' => false, 'muzika' => false, 'klima' => false,
            'seats'   => 3,
            'marka' => 'Peugeot 308', 'boja' => 'siva', 'brojTablica' => 'BG-333-SJ',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $sara, 'voznja_id' => $f21, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +11 dana
        $f22 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Rakovica, Beograd',
            'mestoDo'              => 'Vukov Spomenik, Beograd',
            'departure_lat'        => 44.7630, 'departure_lng' => 20.4380,
            'arrival_lat'          => 44.8025, 'arrival_lng'   => 20.4747,
            'distance_km'          => 8.4,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 107,
            'datumVreme'           => Carbon::now()->addDays(11)->setTime(7, 15),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Seat Leon', 'boja' => 'crna', 'brojTablica' => 'BG-444-AR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $aleksandar, 'voznja_id' => $f22, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $jelena,     'voznja_id' => $f22, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        $f23 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Konjarnik, Beograd',
            'mestoDo'              => 'Savamala, Beograd',
            'departure_lat'        => 44.7870, 'departure_lng' => 20.4980,
            'arrival_lat'          => 44.8092, 'arrival_lng'   => 20.4497,
            'distance_km'          => 6.8,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 86,
            'datumVreme'           => Carbon::now()->addDays(11)->setTime(17, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Nissan Qashqai', 'boja' => 'srebrna', 'brojTablica' => 'BG-555-TV',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $teodora, 'voznja_id' => $f23, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +12 dana
        $f24 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Sremčica, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.7312, 'departure_lng' => 20.3920,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 14.0,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 130,
            'datumVreme'           => Carbon::now()->addDays(12)->setTime(7, 30),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Volkswagen Passat', 'boja' => 'siva', 'brojTablica' => 'BG-666-NS',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nemanja, 'voznja_id' => $f24, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $marko,   'voznja_id' => $f24, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f25 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Karaburma, Beograd',
            'mestoDo'              => 'Terazije, Beograd',
            'departure_lat'        => 44.8390, 'departure_lng' => 20.4830,
            'arrival_lat'          => 44.8152, 'arrival_lng'   => 20.4620,
            'distance_km'          => 5.9,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 74,
            'datumVreme'           => Carbon::now()->addDays(12)->setTime(8, 30),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Kia Ceed', 'boja' => 'bela', 'brojTablica' => 'BG-888-VK',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $vladimir, 'voznja_id' => $f25, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +13 dana
        $f26 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Zemun, Beograd',
            'mestoDo'              => 'Vukov Spomenik, Beograd',
            'departure_lat'        => 44.8415, 'departure_lng' => 20.4010,
            'arrival_lat'          => 44.8025, 'arrival_lng'   => 20.4747,
            'distance_km'          => 11.5,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 107,
            'datumVreme'           => Carbon::now()->addDays(13)->setTime(7, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Volkswagen Golf', 'boja' => 'siva', 'brojTablica' => 'BG-123-AB',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $marko, 'voznja_id' => $f26, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $ivana, 'voznja_id' => $f26, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        $f27 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Grocka, Beograd',
            'mestoDo'              => 'Dorćol, Beograd',
            'departure_lat'        => 44.6710, 'departure_lng' => 20.7070,
            'arrival_lat'          => 44.8270, 'arrival_lng'   => 20.4660,
            'distance_km'          => 30.1,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 192,
            'datumVreme'           => Carbon::now()->addDays(13)->setTime(6, 15),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Honda Civic', 'boja' => 'crvena', 'brojTablica' => 'BG-777-KI',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $katarina, 'voznja_id' => $f27, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // +14 dana
        $f28 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Novi Beograd, Bulevar Mihajla Pupina',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.8070, 'departure_lng' => 20.4240,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 6.4,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 76,
            'datumVreme'           => Carbon::now()->addDays(14)->setTime(8, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Toyota Corolla', 'boja' => 'bela', 'brojTablica' => 'NS-456-CD',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $jovan,  'voznja_id' => $f28, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $stefan, 'voznja_id' => $f28, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f29 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Banovo Brdo, Beograd',
            'mestoDo'              => 'Trg Republike, Beograd',
            'departure_lat'        => 44.7885, 'departure_lng' => 20.4058,
            'arrival_lat'          => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'          => 8.5,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 80,
            'datumVreme'           => Carbon::now()->addDays(14)->setTime(7, 45),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Škoda Octavia', 'boja' => 'plava', 'brojTablica' => 'BG-789-EF',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $ana, 'voznja_id' => $f29, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f30 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Čukarica, Beograd',
            'mestoDo'              => 'Studentski trg, Beograd',
            'departure_lat'        => 44.7912, 'departure_lng' => 20.3975,
            'arrival_lat'          => 44.8195, 'arrival_lng'   => 20.4609,
            'distance_km'          => 12.0,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 115,
            'datumVreme'           => Carbon::now()->addDays(14)->setTime(16, 45),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 2,
            'marka' => 'Renault Clio', 'boja' => 'crvena', 'brojTablica' => 'BG-654-IJ',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $milica, 'voznja_id' => $f30, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $teodora,'voznja_id' => $f30, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        // Additional rides days +2, +3, +5, +7, +11, +12 for volume
        $f31 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Mirijevo, Beograd',
            'mestoDo'              => 'Vukov Spomenik, Beograd',
            'departure_lat'        => 44.7900, 'departure_lng' => 20.5300,
            'arrival_lat'          => 44.8025, 'arrival_lng'   => 20.4747,
            'distance_km'          => 10.5,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 99,
            'datumVreme'           => Carbon::now()->addDays(2)->setTime(17, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Ford Focus', 'boja' => 'plava', 'brojTablica' => 'BG-222-LP',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $luka, 'voznja_id' => $f31, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f32 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Sremčica, Beograd',
            'mestoDo'              => 'Slavija, Beograd',
            'departure_lat'        => 44.7312, 'departure_lng' => 20.3920,
            'arrival_lat'          => 44.8023, 'arrival_lng'   => 20.4651,
            'distance_km'          => 13.1,
            'fuel_price_per_liter' => 185,
            'price_per_seat'       => 122,
            'datumVreme'           => Carbon::now()->addDays(3)->setTime(9, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Volkswagen Passat', 'boja' => 'siva', 'brojTablica' => 'BG-666-NS',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $nemanja, 'voznja_id' => $f32, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $katarina,'voznja_id' => $f32, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f33 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Konjarnik, Beograd',
            'mestoDo'              => 'Trg Republike, Beograd',
            'departure_lat'        => 44.7870, 'departure_lng' => 20.4980,
            'arrival_lat'          => 44.8176, 'arrival_lng'   => 20.4569,
            'distance_km'          => 7.2,
            'fuel_price_per_liter' => 190,
            'price_per_seat'       => 91,
            'datumVreme'           => Carbon::now()->addDays(5)->setTime(17, 30),
            'smoking' => false, 'muzika' => true, 'klima' => false,
            'seats'   => 2,
            'marka' => 'Nissan Qashqai', 'boja' => 'srebrna', 'brojTablica' => 'BG-555-TV',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $teodora, 'voznja_id' => $f33, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $andrea,  'voznja_id' => $f33, 'uloga' => 'putnik', 'status' => 'pending',   'created_at' => now(), 'updated_at' => now()],
        ]);

        $f34 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Karaburma, Beograd',
            'mestoDo'              => 'Ada Ciganlija, Beograd',
            'departure_lat'        => 44.8390, 'departure_lng' => 20.4830,
            'arrival_lat'          => 44.7901, 'arrival_lng'   => 20.4250,
            'distance_km'          => 13.4,
            'fuel_price_per_liter' => 188,
            'price_per_seat'       => 125,
            'datumVreme'           => Carbon::now()->addDays(7)->setTime(17, 0),
            'smoking' => false, 'muzika' => true, 'klima' => true,
            'seats'   => 3,
            'marka' => 'Kia Ceed', 'boja' => 'bela', 'brojTablica' => 'BG-888-VK',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $vladimir, 'voznja_id' => $f34, 'uloga' => 'vozac', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $f35 = DB::table('voznje')->insertGetId([
            'mestoOd'              => 'Rakovica, Beograd',
            'mestoDo'              => 'Novi Beograd, Ušće',
            'departure_lat'        => 44.7630, 'departure_lng' => 20.4380,
            'arrival_lat'          => 44.8168, 'arrival_lng'   => 20.4277,
            'distance_km'          => 10.2,
            'fuel_price_per_liter' => 192,
            'price_per_seat'       => 130,
            'datumVreme'           => Carbon::now()->addDays(11)->setTime(9, 0),
            'smoking' => false, 'muzika' => false, 'klima' => true,
            'seats'   => 2,
            'marka' => 'Seat Leon', 'boja' => 'crna', 'brojTablica' => 'BG-444-AR',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        DB::table('user_voznja')->insert([
            ['user_id' => $aleksandar, 'voznja_id' => $f35, 'uloga' => 'vozac',  'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['user_id' => $filip,      'voznja_id' => $f35, 'uloga' => 'putnik', 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
