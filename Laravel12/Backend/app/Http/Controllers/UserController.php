<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\View\View;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display the user profile.
     * This method is not directly related to authentication but was in your original file.
     */
    public function show(string $id): View
    {
        return view('user.profile', [
            'user' => User::findOrFail($id)
        ]);
    }

    /**
     * Display the current money of the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function showMoney(Request $request)
    {
        // Ensure the user is authenticated.
        // This relies on your API routes being protected by a middleware like 'auth:sanctum'.
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Get the currently authenticated user
        $user = Auth::user();

        // Access the 'current_money' attribute from the user model
        $currentMoney = $user->current_money;

        // Return the current money in a JSON response
        return response()->json([
            'user_id' => $user->id,
            'current_money' => $currentMoney,
            'message' => 'Current money retrieved successfully.'
        ]);
    }

    /**
     * Handle user registration.
     * This method creates a new user in the database and generates an API token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Validate the incoming request data for registration
        $request->validate([
            'name' => ['required', 'string', 'max:255'], // Added: Validation for the name attribute
            'contact_number' => ['required', 'string', 'unique:users,contact_number'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'], // 'confirmed' checks for password_confirmation field
        ]);

        try {
            // Create the new user
            $user = User::create([
                'name' => $request->name, // Added: Storing the name attribute
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash the password before storing
            ]);

            // Generate an API token for the newly created user
            // 'api_token' is the name of the token, you can choose any name.
            $token = $user->createToken('api_token')->plainTextToken;

            // Return a successful JSON response with the user and token
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful!'
            ], 201); // 201 Created status code

        } catch (\Exception $e) {
            // Catch any exceptions during user creation or token generation
            // Log the error for debugging purposes
            Log::error('User registration failed: ' . $e->getMessage());

            // Return an error response
            return response()->json([
                'message' => 'Registration failed. Please try again later.',
                'error' => $e->getMessage() // Only include error message in development, not production
            ], 500); // 500 Internal Server Error
        }
    }

    /**
     * Handle user login.
     * This method authenticates a user using either email or contact number and generates an API token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
     public function login(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'identifier' => ['required', 'string'], // Can be email or contact number
            'password' => ['required', 'string'],
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');

        // Attempt to find the user by email or contact number
        $user = null;
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            // If the identifier looks like an email, try to find by email
            $user = User::where('email', $identifier)->first();
        } else {
            // Otherwise, assume it's a contact number and try to find by contact_number
            $user = User::where('contact_number', $identifier)->first();
        }

        // Check if user exists and password is correct
        if (! $user || ! Hash::check($password, $user->password)) {
            // If authentication fails, throw a validation exception
            throw ValidationException::withMessages([
                'identifier' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Revoke old tokens for the 'api_token' name if necessary
        // This ensures only one active token per user per device/session for this name.
        $user->tokens()->where('name', 'api_token')->delete();

        // Create a new API token for the authenticated user
        $token = $user->createToken('api_token')->plainTextToken;

        // Return a JSON response with the generated token AND the user's ID
        return response()->json([
            'token' => $token,
            'user_id' => $user->id, // Add this line to include the user's ID
        ]);
    }
}
