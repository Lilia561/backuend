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
            // Add a new enum column for account status (active/inactive)
            // Default to 'active' for existing users, assuming they are already approved and active.
            $table->enum('account_status', ['active', 'inactive'])->default('active')->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the column if the migration is rolled back
            $table->dropColumn('account_status');
        });
    }
};
