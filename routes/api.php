<?php

use App\Infrastructure\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('user', [AuthController::class, 'user']);

    Route::prefix('recipes')->group(function () {
        Route::get('/', [RecipeController::class, 'index']);
        Route::post('save', [RecipeController::class, 'save']);
        Route::get('{id}/show', [RecipeController::class, 'show']);
        Route::patch('{id}/update', [RecipeController::class, 'update']);
        Route::delete('{id}/delete', [RecipeController::class, 'delete']);
    });
});
