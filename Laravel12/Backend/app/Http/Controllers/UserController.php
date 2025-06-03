<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\View\View;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Goal;
use Illuminate\Support\Facades\DB;
use App\Models\UserCategoryLimit;
use App\Models\Category;
use Illuminate\Validation\Rules;          // <--- ADD THIS LINE if missing
use Illuminate\Auth\Events\Registered;


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
            'recipient_identifier' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'purpose' => ['nullable', 'string', 'max:255'],
            'category_name' => ['nullable', 'string', 'max:255'], // category_name is now passed from frontend
        ]);

        /** @var User $sender */
        $sender = Auth::user();

        if (!$sender) {
            return response()->json(['message' => 'Unauthorized: Sender not authenticated.'], 401);
        }

        $transferAmount = $request->input('amount');
        // Retrieve the category_name from the request, which now directly comes from the "Purpose/Category" field
        $transactionCategoryName = $request->input('category_name');
        // Fallback for description if category_name is empty, otherwise use category_name
        $descriptionForTransaction = $transactionCategoryName ?: ($request->input('purpose', 'E-Wallet Transfer'));


        // Prevent self-transfer
        if ($sender->email === $request->input('recipient_identifier') || $sender->contact_number === $request->input('recipient_identifier')) {
            return response()->json(['message' => 'Cannot send money to yourself.'], 400);
        }

        /** @var User $recipient */
        $recipient = User::where('email', $request->input('recipient_identifier'))
                        ->orWhere('contact_number', $request->input('recipient_identifier'))
                        ->first();

        if (!$recipient) {
            return response()->json(['message' => 'Recipient not found.'], 404);
        }

        if ($sender->current_money < $transferAmount) {
            return response()->json(['message' => 'Insufficient balance.'], 400);
        }

        // --- Weekly Spending Limit Check (Warning Only) ---
        $warningMessage = null;
        if ($sender->weekly_limit > 0) {
            $this->resetWeeklySpentIfNewWeek($sender);

            $projectedSpent = $sender->weekly_spent_amount + $transferAmount;
            if ($projectedSpent > $sender->weekly_limit) {
                $overAmount = $projectedSpent - $sender->weekly_limit;
                $warningMessage = "Warning: This transaction will put you ₱" . number_format($overAmount, 2) . " over your weekly spending limit of ₱" . number_format($sender->weekly_limit, 2) . ".";
            }
        }

        DB::beginTransaction();

        try {
            $sender->current_money -= $transferAmount;
            $sender->save();

            $recipient->current_money += $transferAmount;
            $recipient->save();

            $transferProduct = Product::firstOrCreate(
                ['product_type' => 'TRANSFER'],
                ['created_at' => now(), 'updated_at' => now()]
            );

            // Record transaction for the sender (Debit)
            Transaction::create([
                'user_id' => $sender->id,
                'sender_id' => $sender->id,
                'receiver_id' => $recipient->id,
                'transaction_date' => now(),
                'amount_spent' => -$transferAmount, // Store as negative, interpret as spent/debit
                'product_id' => $transferProduct->id,
                'description' => $descriptionForTransaction, // Saves ONLY the purpose/category
                'status' => 'completed',
            ]);

            // Record transaction for the recipient (Credit)
            // This remains 'Received from [sender's name/contact]'
            Transaction::create([
                'user_id' => $recipient->id,
                'sender_id' => $sender->id,
                'receiver_id' => $recipient->id,
                'transaction_date' => now(),
                'amount_spent' => +$transferAmount, // Store as positive, interpret as received/credit
                'product_id' => $transferProduct->id,
                'description' => 'Received from ' . ($sender->name ?: $sender->contact_number), // This correctly sets received description
                'status' => 'completed',
            ]);

            $sender = User::find($sender->id);
            $this->resetWeeklySpentIfNewWeek($sender);
            if ($transferAmount > 0) {
                $sender->weekly_spent_amount += $transferAmount;
                $sender->save();
            }

            // --- Update Category Spending Limit ---
            if ($transactionCategoryName && $transferAmount > 0) { // Only track outgoing expenses for categories
                $category = Category::firstOrCreate(['name' => $transactionCategoryName]);

                $userCategoryLimit = UserCategoryLimit::where('user_id', $sender->id)
                                                    ->where('category_id', $category->id)
                                                    ->first();

                if ($userCategoryLimit) {
                    $userCategoryLimit->current_spent_amount += $transferAmount;
                    $userCategoryLimit->save();
                } else {
                    Log::info("Transaction for category '{$transactionCategoryName}' occurred, but no specific limit is set for user {$sender->id}.");
                }
            }


            DB::commit();

            $response = [
                'message' => 'Money sent successfully!',
                'sender_new_balance' => $sender->current_money,
                'recipient_new_balance' => $recipient->current_money,
            ];

            if ($warningMessage) {
                $response['warning'] = $warningMessage;
            }

            return response()->json($response, 200);

        } catch (\Exception $e) {
            DB::rollBack();
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
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = Auth::user();

        $currentMoney = $user->current_money;

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
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'unique:users,contact_number'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'contact_number' => $request->contact_number,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'pending',         // <--- ADDED: New users start as 'pending'
                'account_status' => 'inactive', // <--- ADDED: Set account_status to 'inactive' until approved
                'is_admin' => false,           // <--- ADDED: New users are not admins by default
            ]);

            // This line is important for Laravel's event system, keep it
            event(new Registered($user)); // <--- ADD THIS LINE if missing

            $token = $user->createToken('api_token')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful! Your account is pending admin approval.' // <--- MODIFIED MESSAGE
            ], 201);

        } catch (\Exception $e) {
            Log::error('User registration failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Registration failed. Please try again later.',
                'error' => $e->getMessage()
            ], 500);
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

        $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $identifier = $request->input('identifier');
        $password = $request->input('password');
        $email = $request->input("email");

        $adminEmail = 'advirato@gmail.com';
        $adminPassword = 'adminwhyadminidontknow12';

        if ($email === $adminEmail && $password === $adminPassword) {
            $user = User::where('email', $adminEmail)->first();

            if (!$user) {
                $user = User::create([
                    'name' => 'Admin User',
                    'email' => $adminEmail,
                    'contact_number' => '00000000',
                    'password' => Hash::make($adminPassword),
                    'status' => 'approved',
                    'role' => 'admin'
                ]);
            } else {
                 if (!Hash::check($adminPassword, $user->password)) {
                     $user->password = Hash::make($adminPassword);
                     $user->save();
                 }
                 if ($user->contact_number !== '00000000') {
                     $user->contact_number = '00000000';
                     $user->save();
                 }
                 if ($user->role !== 'admin') {
                     $user->role = 'admin';
                 }
                 $user->save();
            }

            $user->tokens()->where('name', 'admin_token')->delete();

            $token = $user->createToken('admin_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user_id' => $user->id,
                'is_admin' => true,
                'message' => 'Admin login successful!',
            ]);
        }

        $user = null;
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            $user = User::where('email', $identifier)->first();
        } else {
            $user = User::where('contact_number', $identifier)->first();
        }

        if (! $user || ! Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'identifier' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (isset($user->status) && $user->status === 'pending') {
            throw ValidationException::withMessages([
                'identifier' => ['Your account is pending approval. Please wait for an administrator to activate it.'],
            ]);
        }

        $user->tokens()->where('name', 'api_token')->delete();
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user_id' => $user->id,
            'is_admin' => false,
            'message' => 'User login successful!',
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
        // Prioritize authenticated user's ID. Fallback to query parameter for testing/specific cases.
        $userId = Auth::id();

        if (!$userId) {
            $userId = $request->query('user_id');
        }

        if (!$userId) {
            return response()->json(['message' => 'User ID is required or unauthorized.'], 401);
        }

        try {
            // Eager load product, sender, and receiver relationships to get names
            $transactions = Transaction::where('user_id', $userId)
                                ->with('product', 'sender', 'receiver') // MODIFIED HERE: Added sender and receiver eager loading
                                ->orderBy('transaction_date', 'desc')
                                ->get();

            $formattedTransactions = $transactions->map(function ($transaction) {
                $transactionType = $transaction->product ? strtoupper($transaction->product->product_type) : 'GENERAL';
                $isOutgoing = $transaction->amount_spent < 0;

                // Determine the base description. This is the value that will be used.
                // For outgoing, it's the category/purpose.
                // For incoming, it's "Received from [Sender Name]".
                // This is needed for the frontend logic to work with the correct description format.
                $displayLabel = $transaction->description; // The description as saved in DB

                // Determine the amount sign and format.
                $displayAmount = $isOutgoing ? '-' . number_format(abs($transaction->amount_spent), 2) : '+' . number_format($transaction->amount_spent, 2);

                $isPending = false;

                return [
                    'id' => $transaction->id,
                    'date' => Carbon::parse($transaction->transaction_date)->format('m/d/Y'),
                    'type' => $transactionType,
                    'amount' => (float) $transaction->amount_spent,
                    'displayAmount' => $displayAmount,
                    'description' => $displayLabel, // Pass the original description to frontend
                    'status' => $isPending ? 'PENDING' : 'COMPLETED',
                    'is_pending' => $isPending,
                    // Pass sender and receiver names to frontend for dynamic display
                    'sender_name' => $transaction->sender->name ?? $transaction->sender->contact_number, // MODIFIED HERE
                    'receiver_name' => $transaction->receiver->name ?? $transaction->receiver->contact_number, // MODIFIED HERE
                ];
            });

            return response()->json($formattedTransactions);

        } catch (\Exception $e) {
            Log::error('Error fetching user transactions: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching transactions. Please try again later.'], 500);
        }
    }

    /**
     * Store a newly created goal for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeGoal(Request $request)
    {
        $request->validate([
            'purpose' => ['required', 'string', 'max:255'],
            'target_balance' => ['required', 'numeric', 'min:0.01'],
            'target_date' => ['nullable', 'date', 'after_or_equal:today'],
        ]);

        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $goal = Goal::create([
                'user_id' => $user->id,
                'purpose' => $request->purpose,
                'target_balance' => $request->target_balance,
                'current_progress' => 0.00,
                'target_date' => $request->target_date ? Carbon::parse($request->target_date) : null,
            ]);

            return response()->json([
                'message' => 'Goal created successfully!',
                'goal' => $goal
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating goal: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create goal. Please try again.'], 500);
        }
    }

    /**
     * Display a listing of the goals for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserGoals(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $goals = Goal::where('user_id', $user->id)
                         ->orderBy('target_date', 'asc')
                         ->get();

            $formattedGoals = $goals->map(function ($goal) {
                return [
                    'id' => $goal->id,
                    'purpose' => $goal->purpose,
                    'targetAmount' => (float) $goal->target_balance,
                    'currentProgress' => (float) $goal->current_progress,
                    'targetDate' => $goal->target_date ? Carbon::parse($goal->target_date)->format('Y-m-d') : null,
                    'progressPercentage' => $goal->target_balance > 0 ? round(($goal->current_progress / $goal->target_balance) * 100) : 0,
                ];
            });

            return response()->json($formattedGoals);

        } catch (\Exception $e) {
            Log::error('Error fetching goals: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch goals.'], 500);
        }
    }

    /**
     * Display the authenticated user's profile details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProfile(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'contact_number' => $user->contact_number,
            'current_money' => $user->current_money,
            'message' => 'User profile retrieved successfully.'
        ]);
    }

    public function token(Request $request)
    {
        return response()->json(['message' => 'Token endpoint reached.']);
    }

    /**
     * Get financial progress data for the authenticated user.
     * This method aggregates transaction data into daily, weekly, and monthly net changes.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFinancialProgressData(Request $request)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $transactions = Transaction::where('user_id', $userId)
                                ->orderBy('transaction_date', 'asc')
                                ->get();

            $dailyProgress = [];
            $weeklyProgress = [];
            $monthlyProgress = [];

            foreach ($transactions as $transaction) {
                $date = Carbon::parse($transaction->transaction_date);
                $dayKey = $date->format('Y-m-d');
                $dayName = $date->format('D');

                if (!isset($dailyProgress[$dayKey])) {
                    $dailyProgress[$dayKey] = ['name' => $dayName, 'progress' => 0];
                }
                $dailyProgress[$dayKey]['progress'] += (float) $transaction->amount_spent;
            }

            $formattedDaily = array_values($dailyProgress);

            foreach ($dailyProgress as $dateKey => $data) {
                $date = Carbon::parse($dateKey);

                $weekKey = $date->startOfWeek()->format('Y-W');
                $weekName = 'Week ' . $date->weekOfYear;
                if (!isset($weeklyProgress[$weekKey])) {
                    $weeklyProgress[$weekKey] = ['name' => $weekName, 'progress' => 0];
                }
                $weeklyProgress[$weekKey]['progress'] += $data['progress'];

                $monthKey = $date->format('Y-M');
                $monthName = $date->format('M');
                if (!isset($monthlyProgress[$monthKey])) {
                    $monthlyProgress[$monthKey] = ['name' => $monthName, 'progress' => 0];
                }
                $monthlyProgress[$monthKey]['progress'] += $data['progress'];
            }

            $formattedWeekly = array_values($weeklyProgress);
            $formattedMonthly = array_values($monthlyProgress);

            return response()->json([
                'daily' => $formattedDaily,
                'weekly' => $formattedWeekly,
                'monthly' => $formattedMonthly,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching financial progress data: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching financial progress data. Please try again later.'], 500);
        }
    }

    /**
     * Update the specified goal in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateGoal(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $goal = Goal::where('user_id', $user->id)->findOrFail($id);

        $request->validate([
            'purpose' => ['required', 'string', 'max:255'],
            'target_balance' => ['required', 'numeric', 'min:0.01'],
            'target_date' => ['nullable', 'date', 'after_or_equal:today'],
        ]);

        try {
            $goal->update([
                'purpose' => $request->purpose,
                'target_balance' => $request->target_balance,
                'target_date' => $request->target_date ? Carbon::parse($request->target_date) : null,
            ]);

            return response()->json(['message' => 'Goal updated successfully!', 'goal' => $goal]);
        } catch (\Exception $e) {
            Log::error('Error updating goal: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update goal.'], 500);
        }
    }

    /**
     * Remove the specified goal from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteGoal($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $goal = Goal::where('user_id', $user->id)->findOrFail($id);

        try {
            $goal->delete();
            return response()->json(['message' => 'Goal deleted successfully!']);
        } catch (\Exception $e) {
            Log::error('Error deleting goal: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete goal.'], 500);
        }
    }


    /**
     * Set the weekly spending limit for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setWeeklyLimit(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $request->validate([
            'weekly_limit' => ['required', 'numeric', 'min:0'],
        ]);

        try {
            $user->weekly_limit = $request->weekly_limit;
            $user->save();

            return response()->json([
                'message' => 'Weekly spending limit set successfully!',
                'weekly_limit' => $user->weekly_limit,
            ]);
        } catch (\Exception $e) {
            Log::error('Error setting weekly limit: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to set weekly limit. Please try again.'], 500);
        }
    }

    /**
     * Get the weekly spending limit and current spent amount for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWeeklyLimit(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $this->resetWeeklySpentIfNewWeek($user);

        return response()->json([
            'weekly_limit' => (float) $user->weekly_limit,
            'weekly_spent_amount' => (float) $user->weekly_spent_amount,
        ]);
    }

    /**
     * Helper function to reset weekly_spent_amount if a new week has started.
     *
     * @param User $user
     * @return void
     */
    protected function resetWeeklySpentIfNewWeek(User $user): void
    {
        $now = Carbon::now();
        $lastReset = $user->last_week_reset ? Carbon::parse($user->last_week_reset) : null;

        if (!$lastReset || $now->weekOfYear !== $lastReset->weekOfYear || $now->year !== $lastReset->year) {
            $user->weekly_spent_amount = 0;
            $user->last_week_reset = $now->startOfWeek();
            $user->save();
        }
    }

    /**
     * Set a category-specific spending limit for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setCategoryLimit(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'limit_amount' => ['required', 'numeric', 'min:0'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $category = Category::firstOrCreate(['name' => $request->category_name]);

        $userCategoryLimit = UserCategoryLimit::updateOrCreate(
            [
                'user_id' => $user->id,
                'category_id' => $category->id,
            ],
            [
                'limit_amount' => $request->limit_amount,
            ]
        );

        return response()->json([
            'message' => 'Category limit set successfully!',
            'limit' => $userCategoryLimit,
        ]);
    }

    /**
     * Get all category-specific spending limits and current spent amounts for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCategoryLimits(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $limits = UserCategoryLimit::where('user_id', $user->id)
                                        ->with('category')
                                        ->get()
                                        ->map(function($limit) {
                                            $remaining = (float) $limit->limit_amount - (float) $limit->current_spent_amount;
                                            return [
                                                'id' => $limit->id,
                                                'category_name' => $limit->category ? $limit->category->name : 'Uncategorized',
                                                'limit_amount' => (float) $limit->limit_amount,
                                                'current_spent_amount' => (float) $limit->current_spent_amount,
                                                'remaining' => $remaining,
                                                'progressPercentage' => $limit->limit_amount > 0 ? round(((float)$limit->current_spent_amount / (float)$limit->limit_amount) * 100) : 0,
                                            ];
                                        });

            return response()->json(['category_limits' => $limits]);

        } catch (\Exception $e) {
            Log::error('Error fetching category limits: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching category limits. Please try again later.'], 500);
        }
    }
}