<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This migration creates the 'feedbacks' table to store user feedback.
     */
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id(); // Primary key for the feedback entry
            // Foreign key to link feedback to a specific user.
            // It's nullable, meaning feedback can be submitted anonymously if needed.
            // If the user is deleted, their feedback's user_id will be set to null.
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->text('message'); // The actual feedback message, using 'text' for longer content
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns automatically
        });
    }

    /**
     * Reverse the migrations.
     * This method drops the 'feedbacks' table if the migration is rolled back.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
