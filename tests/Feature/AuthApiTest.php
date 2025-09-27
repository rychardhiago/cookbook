<?php
namespace Tests\Feature;

use App\Domain\Users\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_register_a_user()
    {
        $payload = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $response = $this->postJson('/api/register', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['message']);

        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    #[Test]
    public function it_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email' => 'jane@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
    }

    #[Test]
    public function it_rejects_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'invalid@example.com',
            'password' => bcrypt('validpass'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'invalid@example.com',
            'password' => 'wrongpass',
        ]);

        $response->assertStatus(401)
            ->assertJsonStructure(['error']);
    }

    #[Test]
    public function it_denies_access_to_protected_routes_without_token()
    {
        $response = $this->getJson('/api/recipes');

        $response->assertStatus(401);
    }

    #[Test]
    public function it_denies_access_with_invalid_token()
    {
        $response = $this->getJson('/api/recipes', [
            'Authorization' => 'Bearer invalid-token',
            'Accept' => 'application/json',
        ]);

        $response->assertStatus(401);
    }
}
