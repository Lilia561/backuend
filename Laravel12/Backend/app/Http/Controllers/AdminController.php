<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction;
use App\Models\Feedback; // Import the new Feedback Model
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash; 

use Illuminate\Validation\Rules;          // <--- ADD THIS LINE if missing
use Illuminate\Auth\Events\Registered;  

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

    /**
     * Store a new feedback entry.
     * This method saves the feedback message to the database, associating it with the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeFeedback(Request $request)
    {
        // Ensure only authenticated users can submit feedback
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            // Validate the incoming request data for the feedback message
            $request->validate([
                'message' => 'required|string|max:1000', // Feedback message is required and max 1000 characters
            ]);

            // Create a new Feedback record in the database
            $feedback = Feedback::create([
                'user_id' => Auth::id(), // Get the ID of the currently authenticated user
                'message' => $request->message, // The feedback message from the request
            ]);

            // Return a success response with the created feedback data
            return response()->json(['message' => 'Feedback submitted successfully.', 'feedback' => $feedback], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Catch validation errors and return them with a 422 status code
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Catch any other exceptions and log the error
            Log::error('Error submitting feedback: ' . $e->getMessage());
            // Return a generic error message with a 500 status code
            return response()->json(['message' => 'Failed to submit feedback.'], 500);
        }
    }

    /**
     * Get all feedback entries for admin management.
     * Allows searching by feedback message or associated user's name.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllFeedback(Request $request)
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
            // Start with a query for all feedback, eager load the associated user
            $query = Feedback::with('user:id,name');

            // Apply search filter if 'search' parameter is present
            if ($request->has('search')) {
                $searchTerm = $request->input('search');

                $query->where(function ($q) use ($searchTerm) {
                    // Search in the feedback message
                    $q->where('message', 'like', '%' . $searchTerm . '%')
                      // OR search in the associated user's name
                      ->orWhereHas('user', function ($uq) use ($searchTerm) {
                          $uq->where('name', 'like', '%' . $searchTerm . '%');
                      });
                });
            }

            // Order by latest feedback entries
            $feedback = $query->latest()->get();

            return response()->json([
                'feedback' => $feedback,
                'message' => 'Feedback retrieved successfully.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching all feedback: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch feedback.'], 500);
        }
    }


      /**
     * Helper method to perform common admin authorization checks.
     *
     * @return \Illuminate\Http\JsonResponse|null Returns a JSON response if unauthorized, otherwise null.
     */
    private function authorizeAdmin()
    {
        // First, check if any user is authenticated.
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Get the authenticated user. If auth()->check() is true, this will not be null.
        $user = auth()->user();

        // Now, check if the authenticated user has admin privileges.
        // Assuming 'is_admin' is a boolean column on your User model.
        if (!$user->is_admin) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        return null; // Return null if authorization passes
    }




     /**
     * Get all users with 'pending' status for admin approval.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPendingUsers()
    {
        // Perform admin authorization check

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $pendingUsers = User::where('status', 'pending')->get();

            return response()->json($pendingUsers);
        } catch (\Exception $e) {
            Log::error('Error fetching pending users: ' . $e->getMessage());
            return response()->json(['message' => 'Could not fetch pending users.', 'error' => $e->getMessage()], 500);
        }
    }



    /**
     * Approve a user account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveUser(Request $request, $id)
    {
        // Perform admin authorization check
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            // Only approve if the status is currently 'pending'
            if ($user->status !== 'pending') {
                return response()->json(['message' => 'User is not in pending status. Current status: ' . $user->status], 400);
            }

            $user->status = 'approved';
            $user->account_status = 'active'; // Also set account_status to active upon approval
            $user->save();

            // Optionally, send an email notification to the user about approval

            return response()->json(['message' => 'User approved successfully.', 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Error approving user ' . $id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Could not approve user.', 'error' => $e->getMessage()], 500);
        }
    }




    /**
     * Reject a user account.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectUser(Request $request, $id)
    {
        // Perform admin authorization check
       if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            // Only reject if the status is currently 'pending'
            if ($user->status !== 'pending') {
                return response()->json(['message' => 'User is not in pending status. Current status: ' . $user->status], 400);
            }

            $user->status = 'rejected';
            $user->account_status = 'inactive'; // Keep inactive or set to inactive if not already
            $user->save();

            // Optionally, send an email notification to the user about rejection

            return response()->json(['message' => 'User rejected successfully.', 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Error rejecting user ' . $id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Could not reject user.', 'error' => $e->getMessage()], 500);
        }
    }


}