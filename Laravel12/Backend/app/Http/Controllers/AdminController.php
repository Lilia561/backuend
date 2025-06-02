<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction; // MAKE SURE TO IMPORT Transaction Model
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /**
     * Get dashboard metrics for the admin.
     * Includes total users, total transactions, and pending user approvals.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardMetrics(Request $request)
    {
        // Ensure only authenticated users (and ideally, admins) can access this.
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Optional: Add role-based authorization here if you have an 'admin' role
        // if (Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized.'], 403);
        // }

        try {
            // 1. Get Total Users
            $totalUsers = User::count();

            // 2. Get Total Transactions (assuming Transaction model exists)
            $totalTransactions = Transaction::count();

            // 3. Get Pending Approvals (assuming 'status' column exists in 'users' table)
            $pendingApprovals = User::where('status', 'pending')->count();

            return response()->json([
                'totalUsers' => $totalUsers,
                'totalTransactions' => $totalTransactions,
                'pendingApprovals' => $pendingApprovals,
                'message' => 'Admin dashboard metrics retrieved successfully.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching admin dashboard metrics: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch dashboard metrics.'], 500);
        }
    }

    /**
     * Get all users for admin management.
     * This method can also accept search parameters (name or contact_number).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllUsers(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Optional: Add role-based authorization here
        // if (Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized.'], 403);
        // }

        try {
            // Start with a base query for all users
            $query = User::select('id', 'name', 'email', 'contact_number', 'status', 'current_money', 'role', 'account_status');

            // Apply search filter if 'search' parameter is present
            if ($request->has('search') && $request->has('searchBy')) {
                $searchTerm = $request->input('search');
                $searchBy = $request->input('searchBy');

                if ($searchBy === 'name') {
                    $query->where('name', 'like', '%' . $searchTerm . '%');
                } elseif ($searchBy === 'contact_number') {
                    $query->where('contact_number', 'like', '%' . $searchTerm . '%');
                }
            }

            $users = $query->get();

            return response()->json([
                'users' => $users,
                'message' => 'Users retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching all users: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch users.'], 500);
        }
    }

    /**
     * Update a specific user's information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUser(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Optional: Add role-based authorization here
        // if (Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized.'], 403);
        // }

        try {
            $user = User::findOrFail($id); // Find the user or throw a 404 exception

            // Validate the incoming request data
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'nullable',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id), // Ignore current user's email for unique check
                ],
                'contact_number' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('users')->ignore($user->id), // Ignore current user's contact_number for unique check
                ],
                'status' => 'required|in:pending,approved,rejected', // Ensure status is one of the defined enum values
                'current_money' => 'required|numeric|min:0', // Ensure money is a non-negative number
                'role' => 'required|in:user,admin', // Ensure role is one of the defined enum values
                'account_status' => 'required|in:active,inactive', // NEW VALIDATION FOR ACCOUNT STATUS
            ]);

            // Update user attributes
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->contact_number = $request->input('contact_number');
            $user->status = $request->input('status'); // Keep this for initial approval status
            $user->current_money = $request->input('current_money');
            $user->role = $request->input('role');
            $user->account_status = $request->input('account_status'); // UPDATE THE NEW FIELD

            $user->save(); // Save the changes to the database

            return response()->json(['message' => 'User updated successfully.', 'user' => $user]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating user ' . $id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update user.'], 500);
        }
    }

    /**
     * Delete a specific user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Optional: Add role-based authorization here
        // if (Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized.'], 403);
        // }

        try {
            $user = User::findOrFail($id); // Find the user or throw a 404 exception
            $user->delete(); // Delete the user from the database

            return response()->json(['message' => 'User deleted successfully.']);

        } catch (\Exception $e) {
            Log::error('Error deleting user ' . $id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete user.'], 500);
        }
    }

    /**
     * Get all transactions for admin management.
     * Allows searching by sender or receiver user name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllTransactions(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Optional: Add role-based authorization here if you have an 'admin' role
        // if (Auth::user()->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized.'], 403);
        // }

        try {
            // Start with a query for all transactions, eager load sender and receiver details
            // IMPORTANT: We now include 'user' relationship for the original 'user_id'
            $query = Transaction::with(['user:id,name', 'sender:id,name', 'receiver:id,name']);

            // Apply search filter if 'search' parameter is present
            if ($request->has('search')) {
                $searchTerm = $request->input('search');

                $query->where(function ($q) use ($searchTerm) {
                    // Search in original user_id's name
                    $q->whereHas('user', function ($uq) use ($searchTerm) {
                        $uq->where('name', 'like', '%' . $searchTerm . '%');
                    })
                    // OR search in sender's name (if sender_id exists)
                    ->orWhereHas('sender', function ($sq) use ($searchTerm) {
                        $sq->where('name', 'like', '%' . $searchTerm . '%');
                    })
                    // OR search in receiver's name (if receiver_id exists)
                    ->orWhereHas('receiver', function ($rq) use ($searchTerm) {
                        $rq->where('name', 'like', '%' . $searchTerm . '%');
                    });
                });
            }

            // Order by latest transactions
            $transactions = $query->latest()->get();

            return response()->json([
                'transactions' => $transactions,
                'message' => 'Transactions retrieved successfully.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching all transactions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch transactions.'], 500);
        }
    }
}
