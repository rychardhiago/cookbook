<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Recipe;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        Recipe::factory()
            ->count(10)
            ->create()
            ->each(function ($recipe) {
                Ingredient::factory()->count(3)->create([
                    'recipe_id' => $recipe->id
                ]);
            });
    }
}

