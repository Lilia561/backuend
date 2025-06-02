<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add a 'status' column with default 'approved' or 'pending'
            // Using enum is good for predefined states.
            // If you want to require admin approval for new accounts, default should be 'pending'.
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved')->after('password');
            // Or, if you prefer a simple string:
            // $table->string('status')->default('approved')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};