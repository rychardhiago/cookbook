<?php

namespace App\Infrastructure\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Infrastructure\Http\Requests\Api\RecipeRequest;
use App\Domain\Recipes\Models\Recipe;

class RecipeController extends Controller
{
    public function index(Request $request)
    {

        $allowedSorts = ['name', 'created_at', 'updated_at'];
        $sortBy = in_array($request->query('sort_by'), $allowedSorts) ? $request->query('sort_by') : 'created_at';
        $sortOrder = $request->query('sort_order') === 'asc' ? 'asc' : 'desc';

        $perPage = $request->query('per_page', 10);
        $ingredient = $request->query('ingredient');

        $query = Recipe::with('ingredients')
            ->orderBy($sortBy, $sortOrder);

        // Filtro por ingrediente (nome)
        if ($ingredient) {
            $query->whereHas('ingredients', function ($q) use ($ingredient) {
                $q->where('name', 'like', '%' . $ingredient . '%');
            });
        }

        $recipes = $query->paginate($perPage);

        return response()->json($recipes);
    }


    public function store(RecipeRequest $request)
    {
        $validated = $request->validated();

        $recipe = Recipe::create($validated);

        if (isset($validated['ingredients'])) {
            foreach ($validated['ingredients'] as $ingredientData) {
                $recipe->ingredients()->create($ingredientData);
            }
        }

        return response()->json($recipe->load('ingredients'), 201);
    }

    public function show(Recipe $recipe)
    {
        return response()->json($recipe->load('ingredients'));
    }

    public function update(RecipeRequest $request, Recipe $recipe)
    {
        $validated = $request->validated();

        $recipe->update($validated);

        if (isset($validated['ingredients'])) {
            // Remove ingredientes antigos
            $recipe->ingredients()->delete();

            // Adiciona os novos
            foreach ($validated['ingredients'] as $ingredientData) {
                $recipe->ingredients()->create($ingredientData);
            }
        }

        return response()->json($recipe->load('ingredients'));
    }


    public function destroy(Recipe $recipe)
    {
        $recipe->delete();

        return response()->json(null, 204);
    }
}
