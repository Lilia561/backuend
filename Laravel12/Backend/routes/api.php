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

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/money', [UserController::class, 'showMoney']);
    Route::get('/user/profile', [UserController::class, 'getUserProfile']); // Existing route
});


// Admin-specific routes, protected by both sanctum authentication and the custom admin role check
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () {
    Route::get('/admin/dashboard-metrics', [AdminController::class, 'getDashboardMetrics']);
    // Add any other routes that ONLY admins should access here

    // Route to fetch all users for the admin panel
    Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
    // Placeholder routes for updating and deleting users
    Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

    // NEW: Route to fetch all transactions for the admin panel
    Route::get('/admin/transactions', [AdminController::class, 'getAllTransactions']);
});


Route::middleware('auth:sanctum')->group(function () {
    // ... your existing authenticated routes
    Route::get('/user/financial-progress', [UserController::class, 'getFinancialProgressData']);

    // Goal Routes
    Route::post('/goals', [UserController::class, 'storeGoal']); // Route to create a new goal
    Route::get('/goals', [UserController::class, 'getUserGoals']); // Route to fetch all goals for the user
    Route::put('/goals/{id}', [UserController::class, 'updateGoal']); // New: Route to update a specific goal
    Route::delete('/goals/{id}', [UserController::class, 'deleteGoal']); // New: Route to delete a specific goal

    Route::post('/user/set-weekly-limit', [UserController::class, 'setWeeklyLimit']);
    Route::get('/user/weekly-limit', [UserController::class, 'getWeeklyLimit']);
});


Route::get('/transactions/user', [UserController::class, 'getUserTransactions']);

// Route for money transfer
Route::middleware('auth:sanctum')->post('/e-wallet/transfer', [UserController::class, 'sendMoney']);


Route::middleware('auth:sanctum')->group(function () {
    // ... existing routes ...

    Route::post('/user/set-category-limit', [UserController::class, 'setCategoryLimit']);
    Route::get('/user/category-limits', [UserController::class, 'getCategoryLimits']);
});
