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
        Schema::table('transactions', function (Blueprint $table) {
            // Add sender_id and receiver_id
            // Make them nullable initially if existing transactions might not have these values
            // Or ensure you have a strategy to backfill them
            $table->foreignId('sender_id')->nullable()->constrained('users')->onDelete('set null')->after('user_id');
            $table->foreignId('receiver_id')->nullable()->constrained('users')->onDelete('set null')->after('sender_id');

            // Add status column
            $table->enum('status', ['completed', 'pending', 'failed'])->default('completed')->after('description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropConstrainedForeignId('sender_id');
            $table->dropConstrainedForeignId('receiver_id');
            // Then drop the columns
            $table->dropColumn('sender_id');
            $table->dropColumn('receiver_id');
            $table->dropColumn('status');
        });
    }
};
