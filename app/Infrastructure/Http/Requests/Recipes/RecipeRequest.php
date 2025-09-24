<?php

namespace App\Infrastructure\Http\Requests\Recipes;

use Illuminate\Foundation\Http\FormRequest;

class RecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'ingredients' => ['required', 'array'],
            'ingredients.*.item' => ['required', 'string', 'max:255'],
            'ingredients.*.quantity' => ['required', 'integer', 'min:1'],
        ];

        return $rules;
    }
}
