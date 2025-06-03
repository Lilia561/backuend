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
        Schema::create('user_category_limits', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Link to users table
        $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Link to categories table (if using Option A)
        $table->decimal('limit_amount', 10, 2); // The limit for this category
        $table->decimal('current_spent_amount', 10, 2)->default(0.00); // To track spending against this specific category limit
        $table->timestamps();

        // Ensure a user can only have one limit per category
        $table->unique(['user_id', 'category_id']);
    });
    }
};
