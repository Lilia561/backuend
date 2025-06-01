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
        Schema::create('goals', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key for the goal
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to the users table
            $table->string('purpose', 255); // The purpose of the goal (e.g., "New Camera", "Vacation")
            $table->decimal('target_balance', 10, 2); // The target amount for the goal
            $table->decimal('current_progress', 10, 2)->default(0.00); // Current amount saved towards the goal
            $table->date('target_date')->nullable(); // The target date to achieve the goal (nullable)
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};

