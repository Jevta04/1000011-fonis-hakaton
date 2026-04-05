<?php

namespace App\Http\Controllers;

use App\Models\Voznja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RideController extends Controller
{
    /** GET /rides — lista / pretraga voznji */
    public function index(Request $request)
    {
        $query = Voznja::with(['vozac'])
            ->where('datumVreme', '>=', now())
            ->where('seats', '>', 0);

        // Geo pretraga (Haversine) — koristi se kad su dostupni lat/lng
        if ($request->filled('departure_lat') && $request->filled('departure_lng')) {
            $depLat = (float) $request->departure_lat;
            $depLng = (float) $request->departure_lng;
            $radius = (float) ($request->radius_m ?? 2000); // default 2 km

            $query->whereNotNull('departure_lat')
                  ->whereRaw(
                    '(6371000 * acos(
                        LEAST(1, cos(radians(?)) * cos(radians(departure_lat)) *
                        cos(radians(departure_lng) - radians(?)) +
                        sin(radians(?)) * sin(radians(departure_lat)))
                    )) <= ?',
                    [$depLat, $depLng, $depLat, $radius]
                  );
        }

        if ($request->filled('arrival_lat') && $request->filled('arrival_lng')) {
            $arrLat = (float) $request->arrival_lat;
            $arrLng = (float) $request->arrival_lng;
            $radius = (float) ($request->radius_m ?? 2000);

            $query->whereNotNull('arrival_lat')
                  ->whereRaw(
                    '(6371000 * acos(
                        LEAST(1, cos(radians(?)) * cos(radians(arrival_lat)) *
                        cos(radians(arrival_lng) - radians(?)) +
                        sin(radians(?)) * sin(radians(arrival_lat)))
                    )) <= ?',
                    [$arrLat, $arrLng, $arrLat, $radius]
                  );
        }

        // Text fallback (bez geo)
        if ($request->filled('mestoOd') && !$request->filled('departure_lat')) {
            $query->where('mestoOd', 'ilike', '%' . $request->mestoOd . '%');
        }
        if ($request->filled('mestoDo') && !$request->filled('arrival_lat')) {
            $query->where('mestoDo', 'ilike', '%' . $request->mestoDo . '%');
        }

        if ($request->filled('date')) {
            $query->whereDate('datumVreme', $request->date);
        }

        // Sortiranje: po distanci od korisnika (ako su date koordinate), pa po vremenu
        if ($request->filled('user_lat') && $request->filled('user_lng')) {
            $uLat = (float) $request->user_lat;
            $uLng = (float) $request->user_lng;
            $query->selectRaw(
                'voznje.*, (6371 * acos(LEAST(1, cos(radians(?)) * cos(radians(departure_lat)) * cos(radians(departure_lng) - radians(?)) + sin(radians(?)) * sin(radians(departure_lat))))) AS dist_km',
                [$uLat, $uLng, $uLat]
            )->orderByRaw('dist_km ASC NULLS LAST')->orderBy('datumVreme');
        } else {
            $query->orderBy('datumVreme');
        }

        $limit = min((int) ($request->limit ?? 20), 50);
        $rides = $query->limit($limit)->get();
        $currentUserId = auth('sanctum')->id();

        return response()->json($rides->map(fn($r) => $this->format($r, false, $currentUserId)));
    }

    /** POST /rides — kreiranje vožnje */
    public function store(Request $request)
    {
        $data = $request->validate([
            'mestoOd'                => 'required|string|max:255',
            'mestoDo'                => 'required|string|max:255',
            'departure_lat'          => 'nullable|numeric',
            'departure_lng'          => 'nullable|numeric',
            'arrival_lat'            => 'nullable|numeric',
            'arrival_lng'            => 'nullable|numeric',
            'distance_km'            => 'nullable|numeric|min:0',
            'fuel_price_per_liter'   => 'nullable|numeric|min:0',
            'datumVreme'             => 'required|date|after:now',
            'smoking'                => 'boolean',
            'music'                  => 'boolean',
            'airCondition'           => 'boolean',
            'seats'                  => 'integer|min:1|max:8',
            'vozilo.broj_tablica'    => 'required|string|max:20',
            'vozilo.marka'           => 'required|string|max:100',
            'vozilo.boja'            => 'nullable|string|max:50',
            'vozilo.fuel_consumption'=> 'nullable|numeric|min:1|max:50',
        ]);

        $vozilo = $data['vozilo'];

        // Kalkulacija cene po mestu
        $pricePerSeat = null;
        if (isset($data['distance_km'], $data['fuel_price_per_liter'], $vozilo['fuel_consumption'])) {
            $fuelCost     = ($data['distance_km'] / 100) * $vozilo['fuel_consumption'] * $data['fuel_price_per_liter'];
            $seats        = $data['seats'] ?? 4;
            $pricePerSeat = round(($fuelCost * 1.5) / $seats, 0);
        }

        $voznja = Voznja::create([
            'mestoOd'              => $data['mestoOd'],
            'mestoDo'              => $data['mestoDo'],
            'departure_lat'        => $data['departure_lat']        ?? null,
            'departure_lng'        => $data['departure_lng']        ?? null,
            'arrival_lat'          => $data['arrival_lat']          ?? null,
            'arrival_lng'          => $data['arrival_lng']          ?? null,
            'distance_km'          => $data['distance_km']          ?? null,
            'fuel_price_per_liter' => $data['fuel_price_per_liter'] ?? null,
            'price_per_seat'       => $pricePerSeat,
            'datumVreme'           => $data['datumVreme'],
            'smoking'              => $data['smoking']      ?? false,
            'muzika'               => $data['music']        ?? false,
            'klima'                => $data['airCondition'] ?? false,
            'seats'                => $data['seats']        ?? 4,
            'brojTablica'          => $vozilo['broj_tablica'],
            'marka'                => $vozilo['marka'],
            'boja'                 => $vozilo['boja'] ?? null,
        ]);

        $voznja->users()->attach(Auth::id(), ['uloga' => 'vozac', 'status' => 'confirmed']);
        $voznja->load('vozac');

        return response()->json($this->format($voznja), 201);
    }

    /** GET /rides/:id */
    public function show(int $id)
    {
        $voznja = Voznja::with(['vozac', 'putnici'])->findOrFail($id);
        return response()->json($this->format($voznja, true, auth('sanctum')->id()));
    }

    /** POST /rides/:id/join — zahtev za priključivanje */
    public function join(int $id)
    {
        $voznja = Voznja::findOrFail($id);

        if ($voznja->seats <= 0) {
            return response()->json(['message' => 'Vožnja je popunjena.'], 422);
        }

        $userId = Auth::id();

        if ($voznja->vozac()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Ne možete se priključiti sopstvenoj vožnji.'], 422);
        }

        if ($voznja->users()->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Već ste u ovoj vožnji.'], 422);
        }

        $voznja->users()->attach($userId, ['uloga' => 'putnik', 'status' => 'confirmed']);
        $voznja->decrement('seats');

        return response()->json(['message' => 'Uspešno ste se priključili vožnji.']);
    }

    /** PATCH /rides/:id/passengers/:passengerId/confirm */
    public function confirmPassenger(int $id, int $passengerId)
    {
        $voznja = Voznja::findOrFail($id);

        if (!$voznja->vozac()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Samo vozač može potvrditi putnike.'], 403);
        }

        $pivot = DB::table('user_voznja')
            ->where('voznja_id', $id)
            ->where('user_id', $passengerId)
            ->where('uloga', 'putnik')
            ->first();

        if (!$pivot) {
            return response()->json(['message' => 'Putnik nije pronađen.'], 404);
        }

        if ($pivot->status === 'confirmed') {
            return response()->json(['message' => 'Putnik je već potvrđen.'], 422);
        }

        if ($voznja->seats <= 0) {
            return response()->json(['message' => 'Nema slobodnih mesta.'], 422);
        }

        DB::table('user_voznja')
            ->where('voznja_id', $id)
            ->where('user_id', $passengerId)
            ->update(['status' => 'confirmed']);

        $voznja->decrement('seats');

        return response()->json(['message' => 'Putnik potvrđen.']);
    }

    /** PATCH /rides/:id/passengers/:passengerId/reject */
    public function rejectPassenger(int $id, int $passengerId)
    {
        $voznja = Voznja::findOrFail($id);

        if (!$voznja->vozac()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Samo vozač može odbiti putnike.'], 403);
        }

        $updated = DB::table('user_voznja')
            ->where('voznja_id', $id)
            ->where('user_id', $passengerId)
            ->where('uloga', 'putnik')
            ->update(['status' => 'rejected']);

        if (!$updated) {
            return response()->json(['message' => 'Putnik nije pronađen.'], 404);
        }

        return response()->json(['message' => 'Putnik odbijen.']);
    }

    /** GET /rides/:id/passengers */
    public function passengers(int $id)
    {
        $voznja = Voznja::findOrFail($id);

        $isDriver = $voznja->vozac()->where('user_id', Auth::id())->exists();

        $passengers = DB::table('user_voznja')
            ->join('users', 'users.id', '=', 'user_voznja.user_id')
            ->where('user_voznja.voznja_id', $id)
            ->where('user_voznja.uloga', 'putnik')
            ->select(
                'users.id', 'users.ime', 'users.prezime', 'users.email', 'users.brojTelefona',
                'user_voznja.status', 'user_voznja.created_at as requested_at'
            )
            ->get()
            ->map(fn($p) => [
                'id'           => $p->id,
                'name'         => trim("{$p->ime} {$p->prezime}"),
                'email'        => $isDriver ? $p->email : null,
                'phone'        => $isDriver ? $p->brojTelefona : null,
                'avatar'       => strtoupper(substr($p->ime ?? '?', 0, 1)),
                'status'       => $p->status,
                'requested_at' => $p->requested_at,
            ]);

        return response()->json($passengers);
    }

    /** POST /rides/:id/leave */
    public function leave(int $id)
    {
        $voznja = Voznja::findOrFail($id);
        $userId = Auth::id();

        $pivot = $voznja->users()->where('user_id', $userId)->first();

        if (!$pivot || $pivot->pivot->uloga === 'vozac') {
            return response()->json(['message' => 'Ne možete napustiti ovu vožnju.'], 422);
        }

        // Ako je bio confirmed, oslobodi mesto
        if ($pivot->pivot->status === 'confirmed') {
            $voznja->increment('seats');
        }

        $voznja->users()->detach($userId);

        return response()->json(['message' => 'Uspešno ste napustili vožnju.']);
    }

    /** DELETE /rides/:id */
    public function destroy(int $id)
    {
        $voznja = Voznja::findOrFail($id);

        if (!$voznja->vozac()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Nemate dozvolu.'], 403);
        }

        // Cascade delete — user_voznja se briše automatski (FK cascadeOnDelete)
        $voznja->delete();

        return response()->json(['message' => 'Vožnja otkazana.']);
    }

    /** Formatira Voznja objekat za frontend */
    private function format(Voznja $v, bool $withPassengers = false, ?int $currentUserId = null): array
    {
        $vozac = $v->vozac->first();

        $isJoined = $currentUserId
            ? $v->users()->where('user_id', $currentUserId)->where('user_voznja.uloga', 'putnik')->exists()
            : false;

        $result = [
            'id'                   => $v->id,
            'mestoOd'              => $v->mestoOd,
            'mestoDo'              => $v->mestoDo,
            'departure_lat'        => $v->departure_lat,
            'departure_lng'        => $v->departure_lng,
            'arrival_lat'          => $v->arrival_lat,
            'arrival_lng'          => $v->arrival_lng,
            'distance_km'          => $v->distance_km,
            'price_per_seat'       => $v->price_per_seat,
            'datumVreme'           => $v->datumVreme?->format('Y-m-d H:i'),
            'seats'                => $v->seats,
            'smoking'              => $v->smoking,
            'music'                => $v->muzika,
            'airCondition'         => $v->klima,
            'vehicle'              => $v->marka,
            'boja'                 => $v->boja,
            'brojTablica'          => $v->brojTablica,
            'driver'               => $vozac ? trim("{$vozac->ime} {$vozac->prezime}") : null,
            'driverId'             => $vozac?->id,
            'driver_phone'         => $vozac?->brojTelefona,
            'avatar'               => $vozac ? strtoupper(substr($vozac->ime ?? '?', 0, 1)) : '?',
            'isJoined'             => $isJoined,
        ];

        if ($withPassengers) {
            $result['passengers'] = $v->putnici->map(fn($u) => [
                'id'     => $u->id,
                'name'   => trim("{$u->ime} {$u->prezime}"),
                'avatar' => strtoupper(substr($u->ime ?? '?', 0, 1)),
                'status' => $u->pivot->status,
            ]);
        }

        return $result;
    }
}
