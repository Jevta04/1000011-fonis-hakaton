<?php

use App\Http\Controllers\Authentication\RegisterController;
use App\Http\Controllers\Authentication\LoginController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Javne rute (bez autentifikacije)
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/auth/login', [LoginController::class, 'login']);
Route::get('/companies', [CompanyController::class, 'index']);

// Zaštićene rute (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [LoginController::class, 'logout']);

    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::get('/user/rides', [UserController::class, 'rides']);
});
