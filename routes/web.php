<?php

use App\Infrastructure\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::view('/{any}', 'welcome')->where('any', '.*');
