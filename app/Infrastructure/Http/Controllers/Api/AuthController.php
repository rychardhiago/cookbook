<?php

namespace App\Infrastructure\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Infrastructure\Http\Requests\Api\CreateUserRequest;
use App\Infrastructure\Http\Requests\Api\LoginRequest;
use App\Infrastructure\Http\Resources\UserResource;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{

    public function register(CreateUserRequest $request)
    {
        User::createUser($request);
        return response()->json(['message' => 'User register successfully'], 201);
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            if (!$token = auth('api')->attempt($credentials)) {
                return response()->json(['error' => 'Sorry, we cannot find you.'], 401);
            }

            return $this->respondWithToken($token);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], 500);

        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], 500);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent' => $e->getMessage()], 500);

        }
    }

    public function user()
    {
        return new UserResource(auth()->user());
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    // Refresh JWT token
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    // Return token response structure
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
        ]);
    }
}
