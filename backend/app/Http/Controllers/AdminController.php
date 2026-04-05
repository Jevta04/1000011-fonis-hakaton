<?php

namespace App\Http\Controllers;

use App\Models\Kompanija;
use App\Models\User;
use App\Models\Voznja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /** GET /admin/users */
    public function users(Request $request)
    {
        $query = User::with('kompanija')
            ->withCount([
                'voznje as driver_rides'    => fn($q) => $q->where('user_voznja.uloga', 'vozac'),
                'voznje as passenger_rides' => fn($q) => $q->where('user_voznja.uloga', 'putnik'),
            ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ime', 'ilike', "%{$search}%")
                  ->orWhere('prezime', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('created_at')->get()->map(fn($u) => [
            'id'              => $u->id,
            'name'            => trim("{$u->ime} {$u->prezime}"),
            'email'           => $u->email,
            'phone'           => $u->brojTelefona ?? '—',
            'company'         => $u->kompanija?->naziv ?? '—',
            'role'            => $u->uloga,
            'driver_rides'    => $u->driver_rides ?? 0,
            'passenger_rides' => $u->passenger_rides ?? 0,
        ]);

        return response()->json(['data' => $users]);
    }

    /** PUT /admin/users/{id} */
    public function updateUser(Request $request, int $id)
    {
        $user = User::findOrFail($id);
        $data = $request->validate([
            'ime'          => 'sometimes|string|max:100',
            'prezime'      => 'sometimes|string|max:100',
            'uloga'        => 'sometimes|in:korisnik,admin',
            'brojTelefona' => 'sometimes|nullable|string|max:20',
            'kompanija_id' => 'sometimes|nullable|exists:kompanije,id',
        ]);
        $user->update($data);
        return response()->json(['message' => 'Korisnik ažuriran.']);
    }

    /** DELETE /admin/users/{id} */
    public function deleteUser(int $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Korisnik obrisan.']);
    }

    /** GET /admin/rides */
    public function rides(Request $request)
    {
        $query = Voznja::with(['vozac', 'putnici'])->orderByDesc('datumVreme');

        if ($request->filled('date')) {
            $query->whereDate('datumVreme', $request->date);
        }

        $rides = $query->get()->map(function ($v) {
            $vozac          = $v->vozac->first();
            $passengerCount = $v->putnici->count();
            $totalCost      = ($v->price_per_seat && $passengerCount > 0)
                ? round($v->price_per_seat * $passengerCount)
                : null;

            return [
                'id'             => $v->id,
                'from'           => $v->mestoOd,
                'to'             => $v->mestoDo,
                'date'           => $v->datumVreme?->format('d.m.Y H:i'),
                'driver'         => $vozac ? trim("{$vozac->ime} {$vozac->prezime}") : '—',
                'driver_email'   => $vozac?->email ?? '—',
                'seats'          => $v->seats,
                'passengers'     => $passengerCount,
                'distance_km'    => $v->distance_km ? round($v->distance_km, 1) : '—',
                'price_per_seat' => $v->price_per_seat ? round($v->price_per_seat) . ' din' : '—',
                'total_cost'     => $totalCost ? $totalCost . ' din' : '—',
                'vehicle'        => ($v->marka ?? '—') . ($v->brojTablica ? ' · ' . $v->brojTablica : ''),
            ];
        });

        return response()->json(['data' => $rides, 'total' => $rides->count()]);
    }

    /** GET /admin/stats */
    public function stats()
    {
        $totalRides      = Voznja::count();
        $activeRides     = Voznja::where('datumVreme', '>=', now())->where('seats', '>', 0)->count();
        $totalUsers      = User::count();
        $totalCompanies  = Kompanija::count();
        $totalPassengers = DB::table('user_voznja')->where('uloga', 'putnik')->count();

        $totalKm    = Voznja::whereNotNull('distance_km')->sum('distance_km');
        $avgPrice   = Voznja::whereNotNull('price_per_seat')->avg('price_per_seat');
        $avgDist    = Voznja::whereNotNull('distance_km')->avg('distance_km');

        // Zarada po vozaču: suma price_per_seat * broj_putnika za svaku vožnju
        $driverEarnings = DB::table('voznje')
            ->join('user_voznja as uv_d', function ($j) {
                $j->on('uv_d.voznja_id', '=', 'voznje.id')->where('uv_d.uloga', '=', 'vozac');
            })
            ->join('users', 'users.id', '=', 'uv_d.user_id')
            ->leftJoin(
                DB::raw('(SELECT voznja_id, COUNT(*) as cnt FROM user_voznja WHERE uloga = \'putnik\' GROUP BY voznja_id) as passengers'),
                'passengers.voznja_id', '=', 'voznje.id'
            )
            ->whereNotNull('voznje.price_per_seat')
            ->select(
                'users.id',
                DB::raw("CONCAT(users.ime, ' ', users.prezime) as name"),
                'users.email',
                DB::raw('SUM(voznje.price_per_seat * COALESCE(passengers.cnt, 0)) as total_earned'),
                DB::raw('SUM(COALESCE(passengers.cnt, 0)) as total_passengers'),
                DB::raw('COUNT(voznje.id) as total_rides'),
                DB::raw('SUM(COALESCE(voznje.distance_km, 0)) as total_km')
            )
            ->groupBy('users.id', 'users.ime', 'users.prezime', 'users.email')
            ->orderByDesc('total_earned')
            ->get();

        return response()->json([
            'total_rides'      => $totalRides,
            'active_rides'     => $activeRides,
            'total_users'      => $totalUsers,
            'total_companies'  => $totalCompanies,
            'total_passengers' => $totalPassengers,
            'total_km'         => round($totalKm, 1),
            'avg_price'        => $avgPrice ? round($avgPrice) : 0,
            'avg_distance'     => $avgDist  ? round($avgDist, 1) : 0,
            'driver_earnings'  => $driverEarnings,
        ]);
    }

    /** GET /admin/companies */
    public function companies()
    {
        $companies = Kompanija::withCount('users')
            ->get()
            ->map(fn($k) => [
                'id'          => $k->id,
                'name'        => $k->naziv,
                'pib'         => $k->pib ?? '—',
                'users_count' => $k->users_count,
            ]);

        return response()->json($companies);
    }

    /** PUT /admin/rides/{id} */
    public function updateRide(Request $request, int $id)
    {
        $voznja = Voznja::findOrFail($id);
        $data = $request->validate([
            'datumVreme' => 'sometimes|date',
            'seats'      => 'sometimes|integer|min:0|max:8',
            'smoking'    => 'sometimes|boolean',
            'muzika'     => 'sometimes|boolean',
            'klima'      => 'sometimes|boolean',
        ]);
        $voznja->update($data);
        return response()->json(['message' => 'Vožnja ažurirana.']);
    }

    /** DELETE /admin/rides/{id} */
    public function deleteRide(int $id)
    {
        $ride = Voznja::findOrFail($id);
        $ride->delete();
        return response()->json(['message' => 'Vožnja obrisana.']);
    }

    /** GET /admin/charts */
    public function chartData()
    {
        $days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $days->push(now()->subDays($i)->startOfDay());
        }

        $srDays = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

        $kmRaw = DB::table('voznje')
            ->selectRaw("DATE(\"datumVreme\") as date, COALESCE(SUM(distance_km), 0) as total_km")
            ->whereBetween('datumVreme', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->groupByRaw("DATE(\"datumVreme\")")
            ->get()->keyBy('date');

        $passRaw = DB::table('user_voznja')
            ->join('voznje', 'voznje.id', '=', 'user_voznja.voznja_id')
            ->where('user_voznja.uloga', 'putnik')
            ->selectRaw("DATE(voznje.\"datumVreme\") as date, COUNT(*) as total_passengers")
            ->whereBetween('voznje.datumVreme', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->groupByRaw("DATE(voznje.\"datumVreme\")")
            ->get()->keyBy('date');

        $totalRevenue = DB::table('user_voznja')
            ->join('voznje', 'voznje.id', '=', 'user_voznja.voznja_id')
            ->where('user_voznja.uloga', 'putnik')
            ->where('user_voznja.status', 'confirmed')
            ->whereNotNull('voznje.price_per_seat')
            ->sum('voznje.price_per_seat');

        $daily = $days->map(function ($day) use ($kmRaw, $passRaw, $srDays) {
            $dateStr = $day->format('Y-m-d');
            $dow = (int)$day->format('N') - 1; // 0=Mon
            return [
                'date'       => $dateStr,
                'label'      => $srDays[$dow],
                'km'         => round((float)($kmRaw[$dateStr]->total_km ?? 0), 1),
                'passengers' => (int)($passRaw[$dateStr]->total_passengers ?? 0),
            ];
        })->values();

        return response()->json([
            'daily'         => $daily,
            'total_revenue' => round($totalRevenue),
        ]);
    }
}
