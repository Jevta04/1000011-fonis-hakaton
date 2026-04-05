# EverRoute — Interni sistem za deljenje prevoza

> **Fonis Hakaton 2026** — organizator: Fonis organizacija | 4. – 5. april 2026.
> Tema: *„Razvoj digitalnog rešenja koje unapređuje svakodnevni život u gradu kroz pametno upravljanje resursima i uslugama"*

EverRoute je web aplikacija namenjena kompanijama koje žele da organizuju deljenje prevoza između zaposlenih. Cilj je smanjiti troškove prevoza, emisiju CO₂ i broj automobila u saobraćaju, tako što zaposleni mogu da objave ili pronađu vožnje do i od posla.

## Funkcionalnosti

- **Pretraga vožnji** — pronađi dostupne vožnje po lokaciji i datumu, sa prikazom najbližih i najranijih polazaka
- **Objavljivanje vožnji** — vozač kreira vožnju u tri koraka (ruta, vozilo i opcije, pregled), sa automatskim izračunavanjem distance i cene po osobi
- **Profil korisnika** — pregled predstojeće vožnje (po ulozi vozača/putnika), istorija vožnji, upravljanje vozilima i izmena broja telefona
- **Admin panel** — statistički prikaz (ukupne vožnje, korisnici, km, prosečna cena), tabele korisnika/vožnji/kompanija/zarade vozača, CSV export, grafikoni aktivnosti po danima
- **Višejezičnost** — podrška za srpski i engleski jezik
- **Tamna/svetla tema** — prebacivanje u realnom vremenu

## Tehnologije

| Sloj | Stack |
|------|-------|
| Frontend | React 18, Vite, React Router, GSAP, Google Charts |
| Backend | Laravel 12, PHP 8.5, Laravel Sanctum (JWT) |
| Baza podataka | PostgreSQL |
| Mape | OpenStreetMap / Leaflet, Nominatim geocoding |

## Pokretanje projekta

### Backend

```bash
cd backend
cp .env.example .env
# Popuni DB_DATABASE, DB_USERNAME, DB_PASSWORD u .env

php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

> Zahteva PHP 8.2+ i PostgreSQL.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Aplikacija se otvara na `http://localhost:5173`.

## Kolaboratori

| GitHub | Uloga |
|--------|-------|
| [@Jevta04](https://github.com/Jevta04) | Full-stack |
| [@JohnLandlack](https://github.com/JohnLandlack) | Full-stack |
| [@Lazar-220](https://github.com/Lazar-220) | Full-stack |
