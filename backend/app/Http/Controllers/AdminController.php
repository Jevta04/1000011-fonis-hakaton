<?php

namespace App\Http\Controllers;

use App\Models\Kompanija;
use App\Models\User;
use App\Models\Voznja;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /** GET /admin/users */
    public function users(Request $request)
    {
        $query = User::with('kompanija')
            ->select('id', 'ime', 'prezime', 'email', 'uloga', 'brojTelefona', 'kompanija_id', 'created_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ime', 'ilike', "%{$search}%")
                  ->orWhere('prezime', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($users);
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
        $query = Voznja::with(['vozac'])
            ->orderByDesc('datumVreme');

        if ($request->filled('date')) {
            $query->whereDate('datumVreme', $request->date);
        }

        $rides = $query->paginate(20);

        return response()->json([
            'data'         => $rides->items(),
            'total'        => $rides->total(),
            'current_page' => $rides->currentPage(),
            'last_page'    => $rides->lastPage(),
        ]);
    }

    /** GET /admin/stats */
    public function stats()
    {
        $totalRides     = Voznja::count();
        $activeRides    = Voznja::where('datumVreme', '>=', now())->where('seats', '>', 0)->count();
        $totalUsers     = User::count();
        $totalCompanies = Kompanija::count();

        // Total passengers (pivot entries with 'putnik' role)
        $totalPassengers = \DB::table('user_voznja')->where('uloga', 'putnik')->count();

        return response()->json([
            'total_rides'      => $totalRides,
            'active_rides'     => $activeRides,
            'total_users'      => $totalUsers,
            'total_companies'  => $totalCompanies,
            'total_passengers' => $totalPassengers,
        ]);
    }

    /** GET /admin/companies */
    public function companies()
    {
        return response()->json(Kompanija::withCount('users')->get());
    }

    /** DELETE /admin/rides/{id} */
    public function deleteRide(int $id)
    {
        $ride = Voznja::findOrFail($id);
        $ride->delete();
        return response()->json(['message' => 'Vožnja obrisana.']);
    }
}
