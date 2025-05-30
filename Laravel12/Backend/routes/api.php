<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/showMoney', [UserController::class, 'token'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/money', [UserController::class, 'showMoney']);
});

Route::get('/transactions/user', [UserController::class, 'getUserTransactions']);

// <--- ADD THIS NEW ROUTE FOR MONEY TRANSFER ---
Route::middleware('auth:sanctum')->post('/e-wallet/transfer', [UserController::class, 'sendMoney']);
