<?php
namespace Tests\Feature;

use App\Domain\Recipes\Models\Recipe;
use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecipeApiTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticatedHeaders()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'expires_in']);

        $token = $response->json('access_token');
        $this->assertNotEmpty($token);

        // Store the token for subsequent requests in the same test
        return 'Bearer '.$token;
    }

    /** @test */
    public function it_can_create_a_recipe_with_ingredients()
    {
        $payload = [
            'name' => 'Bolo de Chocolate',
            'description' => 'Delicioso',
            'ingredients' => [
                ['name' => 'Açúcar', 'quantity' => '1 xícara'],
                ['name' => 'Chocolate', 'quantity' => '2 colheres']
            ]
        ];

        $response = $this->postJson('/api/recipes', $payload, ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Bolo de Chocolate']);

        $this->assertDatabaseHas('recipes', ['name' => 'Bolo de Chocolate']);
        $this->assertDatabaseHas('ingredients', ['name' => 'Açúcar']);
    }

    /** @test */
    public function it_can_list_recipes_with_pagination_and_sorting()
    {
        Recipe::factory()->count(15)->create();

        $response = $this->getJson('/api/recipes?per_page=5&sort_by=name&sort_order=asc', ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'last_page', 'per_page']);
    }

    /** @test */
    public function it_can_filter_recipes_by_ingredient()
    {
        $recipe = Recipe::factory()->create(['name' => 'Com Chocolate']);
        $recipe->ingredients()->create(['name' => 'Chocolate', 'quantity' => '1 xícara']);

        $response = $this->getJson('/api/recipes?ingredient=chocolate', ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Com Chocolate']);
    }

    /** @test */
    public function it_can_show_a_single_recipe_with_ingredients()
    {
        $recipe = Recipe::factory()->create();
        $recipe->ingredients()->create(['name' => 'Açúcar', 'quantity' => '1 xícara']);

        $response = $this->getJson("/api/recipes/{$recipe->id}", ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Açúcar']);
    }

    /** @test */
    public function it_can_update_a_recipe_and_replace_ingredients()
    {
        $recipe = Recipe::factory()->create(['name' => 'Antigo']);
        $recipe->ingredients()->create(['name' => 'Velho', 'quantity' => '1']);

        $payload = [
            'name' => 'Novo',
            'description' => 'Atualizado',
            'ingredients' => [
                ['name' => 'Novo Ingrediente', 'quantity' => '2']
            ]
        ];

        $response = $this->putJson("/api/recipes/{$recipe->id}", $payload, ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Novo']);

        $this->assertDatabaseMissing('ingredients', ['name' => 'Velho']);
        $this->assertDatabaseHas('ingredients', ['name' => 'Novo Ingrediente']);
    }

    /** @test */
    public function it_can_delete_a_recipe_and_its_ingredients()
    {
        $recipe = Recipe::factory()->create();
        $recipe->ingredients()->create(['name' => 'Test', 'quantity' => '1']);

        $response = $this->deleteJson("/api/recipes/{$recipe->id}", ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
        $this->assertDatabaseMissing('ingredients', ['recipe_id' => $recipe->id]);
    }

    /** @test */
    public function it_validates_required_fields_when_creating_recipe()
    {
        $response = $this->postJson('/api/recipes', [], ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function it_validates_ingredient_name_is_required()
    {
        $payload = [
            'name' => 'Bolo Simples',
            'ingredients' => [
                ['quantity' => '1 xícara'] // falta o 'name'
            ]
        ];

        $response = $this->postJson('/api/recipes', $payload, ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['ingredients.0.name']);
    }

    /** @test */
    public function it_returns_404_when_recipe_not_found()
    {
        $response = $this->getJson('/api/recipes/999', ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(404);
    }

    /** @test */
    public function it_returns_404_when_deleting_non_existing_recipe()
    {
        $response = $this->deleteJson('/api/recipes/999', ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(404);
    }

    /** @test */
    public function it_ignores_invalid_sort_column_and_falls_back_to_default()
    {
        Recipe::factory()->count(5)->create();

        $response = $this->getJson('/api/recipes?sort_by=invalid_column', ['Authorization' => $this->authenticatedHeaders()]);

        $response->assertStatus(200)
            ->assertJsonStructure(['data']);
    }
}
