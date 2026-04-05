<?php

use App\Http\Controllers\Authentication\RegisterController;
use App\Http\Controllers\Authentication\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\RideController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use Illuminate\Support\Facades\Route;

// Javne rute (bez autentifikacije)
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::get('/companies', [CompanyController::class, 'index']);
Route::post('/companies', [CompanyController::class, 'store']);
Route::get('/rides', [RideController::class, 'index']);
Route::get('/rides/{id}', [RideController::class, 'show']);

// Zaštićene rute (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [LoginController::class, 'logout']);
    Route::get('/auth/me', [UserController::class, 'profile']);

    // Profil
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::get('/user/rides', [UserController::class, 'rides']);

    // Vozila
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);

    // Vožnje
    Route::post('/rides', [RideController::class, 'store']);
    Route::post('/rides/{id}/join', [RideController::class, 'join']);
    Route::post('/rides/{id}/leave', [RideController::class, 'leave']);
    Route::delete('/rides/{id}', [RideController::class, 'destroy']);

    // Putnici u vožnji (upravljanje od strane vozača)
    Route::get('/rides/{id}/passengers', [RideController::class, 'passengers']);
    Route::patch('/rides/{id}/passengers/{passengerId}/confirm', [RideController::class, 'confirmPassenger']);
    Route::patch('/rides/{id}/passengers/{passengerId}/reject', [RideController::class, 'rejectPassenger']);

    // Admin rute
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/rides', [AdminController::class, 'rides']);
        Route::put('/rides/{id}', [AdminController::class, 'updateRide']);
        Route::delete('/rides/{id}', [AdminController::class, 'deleteRide']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/charts', [AdminController::class, 'chartData']);
        Route::get('/companies', [AdminController::class, 'companies']);
        Route::put('/companies/{id}', [AdminController::class, 'updateCompany']);
    });
});
