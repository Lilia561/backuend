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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id(); // transaction_id as primary key

            // Foreign key to users table
            // It correctly references the 'id' column on the 'users' table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->date('transaction_date'); // Date of the transaction
            $table->decimal('amount_spent', 10, 2); // Money spent, e.g., 12345678.99

            // Foreign key to products table (assuming you keep the products table)
            // Still nullable, meaning a transaction doesn't *have* to be linked to a product_type
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');

            $table->string('description', 255)->nullable(); // Optional description
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};