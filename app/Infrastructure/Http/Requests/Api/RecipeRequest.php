<?php

namespace App\Infrastructure\Http\Requests\Api;

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
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.name' => ['required', 'string', 'max:255'],
            'ingredients.*.quantity' => ['required', 'string', 'max:255'],
        ];

        return $rules;
    }

    public function messages(): array
    {
        return [
            'ingredients.required' => 'At least one ingredient is required.',
            'ingredients.*.name.required' => 'The name for each ingredient is required.',
            'ingredients.*.quantity.required' => 'The quantity for each ingredient is required.',
        ];
    }
}
