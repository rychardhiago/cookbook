<?php

use App\Infrastructure\Http\Controllers\Api\MetricsController;
use App\Infrastructure\Http\Controllers\Api\AuthController;
use App\Infrastructure\Http\Controllers\Api\RecipeController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('user', [AuthController::class, 'user']);

    Route::apiResource('recipes', RecipeController::class);
});

Route::middleware('auth:api')->get('/metrics', [MetricsController::class, 'index']);
