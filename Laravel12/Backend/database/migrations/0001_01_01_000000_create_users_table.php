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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Add the 'name' column and make it non-nullable
            $table->string('name')->notNullable(); // Changed from ->nullable() to ->notNullable()

            // Contact Number (unique and required)
            $table->string('contact_number')->unique();

            // Email (optional, but good for communication)
            $table->string('email')->nullable(); // Make email nullable as contact_number is primary unique

            $table->timestamp('email_verified_at')->nullable(); // Keep if you plan to use email verification

            $table->string('password');
            $table->rememberToken();

            // Add the 'current_money' column
            $table->decimal('current_money', 10, 2)->default(0.00); // Using decimal for currency, with a default value

            $table->timestamps();
        });

        // Keep these tables if you need them for password resets and sessions
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

