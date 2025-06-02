<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // Import the User model
use App\Models\Transaction; // Import the Transaction model
use Illuminate\Support\Facades\Auth; // For authentication checks
use Illuminate\Support\Facades\Log; // For logging errors

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
        // For a full admin panel, you'd typically have an 'admin' middleware
        // that checks a 'role' column on the user or similar.
        // For now, we'll just ensure they are authenticated.
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            // 1. Get Total Users
            $totalUsers = User::count();

            // 2. Get Total Transactions
            $totalTransactions = Transaction::count();

            // 3. Get Pending Approvals
            // This assumes you have a 'status' column in your 'users' table.
            // If not, please run the migration provided below to add it.
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

    // You can add more admin-specific methods here, e.g.,
    // public function manageUsers(Request $request) { ... }
    // public function viewAllTransactions(Request $request) { ... }
}