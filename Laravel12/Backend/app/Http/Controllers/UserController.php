<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\View\View;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon; // For date formatting
use App\Models\Transaction;
use App\Models\Product; // Make sure to import the Product model
use Illuminate\Support\Facades\DB; // For database transactions

class UserController extends Controller
{
    /**
     * Handle the money transfer between users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMoney(Request $request)
    {
        // 1. Validate the request data
        $request->validate([
            'recipient_identifier' => ['required', 'string'], // Email or contact number of recipient
            'amount' => ['required', 'numeric', 'min:0.01'], // Amount must be positive
            'purpose' => ['nullable', 'string', 'max:255'],  // Optional purpose/description
        ]);

        // Get the authenticated sender
        // This assumes the API route is protected by 'auth:sanctum' middleware
        /** @var User $sender */ // <--- ADDED: Type hint for IDE
        $sender = Auth::user();

        if (!$sender) {
            return response()->json(['message' => 'Unauthorized: Sender not authenticated.'], 401);
        }

        $transferAmount = $request->input('amount');
        $purpose = $request->input('purpose', 'E-Wallet Transfer'); // Default purpose if not provided

        // Prevent self-transfer
        if ($sender->email === $request->input('recipient_identifier') || $sender->contact_number === $request->input('recipient_identifier')) {
            return response()->json(['message' => 'Cannot send money to yourself.'], 400);
        }

        // 2. Find the recipient
        /** @var User $recipient */ // <--- ADDED: Type hint for IDE
        $recipient = User::where('email', $request->input('recipient_identifier'))
                         ->orWhere('contact_number', $request->input('recipient_identifier'))
                         ->first();

        if (!$recipient) {
            return response()->json(['message' => 'Recipient not found.'], 404);
        }

        // 3. Check if sender has sufficient balance
        if ($sender->current_money < $transferAmount) {
            return response()->json(['message' => 'Insufficient balance.'], 400);
        }

        // 4. Perform the transaction using a database transaction
        // This ensures that either all database operations succeed, or none of them do.
        DB::beginTransaction();

        try {
            // Deduct from sender's balance
            $sender->current_money -= $transferAmount;
            $sender->save();

            // Add to recipient's balance
            $recipient->current_money += $transferAmount;
            $recipient->save();

            // Find or create a 'Transfer' product type for transactions
            // IMPORTANT: Ensure you have a 'TRANSFER' product_type in your 'products' table.
            // You might want to seed this product type if it doesn't exist.
            $transferProduct = Product::firstOrCreate(
                ['product_type' => 'TRANSFER'],
                ['created_at' => now(), 'updated_at' => now()] // Add timestamps if needed
            );

            // Record transaction for the sender (Debit)
            Transaction::create([
                'user_id' => $sender->id,
                'transaction_date' => now(),
                'amount_spent' => -$transferAmount, // Store as negative, interpret as spent/debit
                'product_id' => $transferProduct->id,
                'description' => 'Sent to ' . ($recipient->name ?: $recipient->contact_number) . ': ' . $purpose,
                // You might add a 'type' column like 'DEBIT' or 'TRANSFER_OUT' for clearer history
            ]);

            // Record transaction for the recipient (Credit)
            Transaction::create([
                'user_id' => $recipient->id,
                'transaction_date' => now(),
                'amount_spent' => $transferAmount, // Store as positive, interpret as received/credit
                'product_id' => $transferProduct->id,
                'description' => 'Received from ' . ($sender->name ?: $sender->contact_number) . ': ' . $purpose,
                // You might add a 'type' column like 'CREDIT' or 'TRANSFER_IN' for clearer history
            ]);

            DB::commit(); // Commit the transaction if all operations are successful

            return response()->json([
                'message' => 'Money sent successfully!',
                'sender_new_balance' => $sender->current_money,
                'recipient_new_balance' => $recipient->current_money,
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback on error
            Log::error('Money transfer failed: ' . $e->getMessage(), [
                'sender_id' => $sender->id,
                'recipient_identifier' => $request->input('recipient_identifier'),
                'amount' => $transferAmount,
                'error_trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['message' => 'Money transfer failed. Please try again.'], 500);
        }
    }

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


    /**
     * Get transactions for a specific user.
     *
     * This method fetches transaction data from the database,
     * eager-loads the associated product type, and formats the output
     * for the React frontend.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserTransactions(Request $request)
    {
        // --- IMPORTANT: AUTHENTICATION AND USER ID HANDLING ---
        // In a real-world application, you would typically get the user ID
        // from the authenticated user (e.g., using Laravel Sanctum, Passport, or session).
        // For demonstration purposes, we'll use a query parameter.
        // Replace this with actual authentication logic in a production environment.
        $userId = $request->query('user_id'); // Example: access with /api/transactions/user?user_id=1

        // If no user ID is provided, or if the user is not authenticated,
        // you might want to return an error or a default.
        if (!$userId) {
            // For now, let's assume a default user ID for testing if none is provided.
            // In production, you would typically return a 401 Unauthorized response.
            // return response()->json(['message' => 'User ID is required or unauthorized.'], 401);
            $userId = 1; // Default to user ID 1 for testing purposes.
                         // REMEMBER TO REPLACE THIS WITH AUTHENTICATED USER ID!
        }

        try {
            // Fetch transactions for the given user ID.
            // Eager load the 'product' relationship to get the product_type efficiently.
            // Order by transaction_date in descending order to show latest first.
            $transactions = Transaction::where('user_id', $userId)
                                ->with('product') // Assumes a 'product' relationship in your Transaction model
                                ->orderBy('transaction_date', 'desc')
                                ->get();

            // Format the transactions to match the structure expected by your React component.
            $formattedTransactions = $transactions->map(function ($transaction) {
                // Determine the transaction type. If a product is linked, use its type; otherwise, default to 'GENERAL'.
                $transactionType = $transaction->product ? strtoupper($transaction->product->product_type) : 'GENERAL';

                // Determine the amount sign and format.
                // The amount_spent is stored as a positive value, we need to add the sign based on context.
                // For simplicity, we'll assume negative for all, and positive for 'SALARY' or 'INCOME' types.
                // You might have a 'transaction_type' column in your transactions table for this.
                $isPositive = in_array($transactionType, ['SALARY', 'INCOME', 'DEPOSIT']);
                // Corrected: Use abs() for negative amounts to ensure correct formatting with the '-' prefix
                $displayAmount = $isPositive ? '+' . number_format($transaction->amount_spent, 2) : '-' . number_format(abs($transaction->amount_spent), 2);

                // For the "PENDING" status, you would typically have a 'status' column in your transactions table.
                // For this example, we'll assume all fetched transactions are 'COMPLETED' unless explicitly marked.
                $isPending = false; // Set to true if you have a 'status' column and it's 'pending'

                return [
                    'id' => $transaction->id,
                    'date' => Carbon::parse($transaction->transaction_date)->format('m/d/Y'), // Format date as MM/DD/YYYY
                    'type' => $transactionType,
                    'amount' => $transaction->amount_spent, // Keep original amount for calculations if needed
                    'displayAmount' => $displayAmount, // Formatted string for display
                    'description' => $transaction->description,
                    'status' => $isPending ? 'PENDING' : 'COMPLETED',
                    'is_pending' => $isPending,
                ];
            });

            // Return the formatted transactions as a JSON response.
            return response()->json($formattedTransactions);

        } catch (\Exception $e) {
            // Log the error and return a server error response.
            Log::error('Error fetching user transactions: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching transactions. Please try again later.'], 500);
        }
    }
}
