<?php

namespace App\Domain\Recipes\Models;

use Database\Factories\RecipeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    /** @use HasFactory<\Database\Factories\RecipeFactory> */
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }

    protected static function newFactory()
    {
        return RecipeFactory::new();
    }
}
