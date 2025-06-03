<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController; // Import the new AdminController
use App\Http\Middleware\AdminMiddleware;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/showMoney', [UserController::class, 'token'])->middleware('auth:sanctum');

// Main group for all authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // User-specific routes
    Route::get('/user/money', [UserController::class, 'showMoney']);
    Route::get('/user/profile', [UserController::class, 'getUserProfile']);

    // Financial Progress & Limits
    Route::get('/user/financial-progress', [UserController::class, 'getFinancialProgressData']);
    Route::post('/user/set-weekly-limit', [UserController::class, 'setWeeklyLimit']);
    Route::get('/user/weekly-limit', [UserController::class, 'getWeeklyLimit']);
    Route::post('/user/set-category-limit', [UserController::class, 'setCategoryLimit']);
    Route::get('/user/category-limits', [UserController::class, 'getCategoryLimits']);

    // Goal Routes
    Route::post('/goals', [UserController::class, 'storeGoal']);
    Route::get('/goals', [UserController::class, 'getUserGoals']);
    Route::put('/goals/{id}', [UserController::class, 'updateGoal']);
    Route::delete('/goals/{id}', [UserController::class, 'deleteGoal']);

    // Money Transfer
    Route::post('/e-wallet/transfer', [UserController::class, 'sendMoney']);

    // User Feedback Submission (now correctly protected by auth:sanctum)
    Route::post('/feedback', [AdminController::class, 'storeFeedback']);

    // Admin-specific routes, protected by both sanctum authentication and the custom admin role check
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/admin/dashboard-metrics', [AdminController::class, 'getDashboardMetrics']);
        Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/admin/transactions', [AdminController::class, 'getAllTransactions']);
        Route::get('/admin/feedback', [AdminController::class, 'getAllFeedback']); // Admin view for all feedback
        Route::get('admin/pending-users', [AdminController::class, 'getPendingUsers']);
        Route::post('admin/approve-user/{id}', [AdminController::class, 'approveUser']);
        Route::post('admin/reject-user/{id}', [AdminController::class, 'rejectUser']);
    });
});

// This route was previously outside authentication, moved inside the auth:sanctum group above.
// If you still need it publicly accessible, move it back out.
Route::get('/transactions/user', [UserController::class, 'getUserTransactions']);

Route::post('/register', [UserController::class, 'register']);

// Public routes (if any, typically login/register/forgot-password)
// These routes are usually defined separately and do not require authentication middleware.
// Example:
// Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);
// Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
// ... other public routes ...
