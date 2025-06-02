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
Route::middleware(['auth:sanctum', AdminMiddleware::class])->group(function () { // <--- CHANGED THIS LINE
    Route::get('/admin/dashboard-metrics', [AdminController::class, 'getDashboardMetrics']);
    // Add any other routes that ONLY admins should access here
});


Route::middleware('auth:sanctum')->group(function () {
    // ... your existing authenticated routes
    Route::get('/user/financial-progress', [UserController::class, 'getFinancialProgressData']);
});


Route::get('/transactions/user', [UserController::class, 'getUserTransactions']);

// <--- ADD THIS NEW ROUTE FOR MONEY TRANSFER ---
Route::middleware('auth:sanctum')->post('/e-wallet/transfer', [UserController::class, 'sendMoney']);

// New Goal Routes
Route::middleware('auth:sanctum')->post('/goals', [UserController::class, 'storeGoal']); // Route to create a new goal
Route::middleware('auth:sanctum')->get('/goals', [UserController::class, 'getUserGoals']); // Route to fetch all goals for the user