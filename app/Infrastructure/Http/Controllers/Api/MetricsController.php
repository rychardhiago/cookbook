<?php

namespace App\Infrastructure\Http\Controllers\Api;

use App\Domain\Recipes\Models\Recipe;
use App\Domain\Recipes\Models\Ingredient;
use App\Domain\Users\Models\User;
use Illuminate\Routing\Controller;

class MetricsController extends Controller
{
    public function index()
    {
        return response()->json([
            'recipes' => Recipe::count(),
            'ingredients' => Ingredient::count(),
            'users' => User::count(),
        ]);
    }
}
