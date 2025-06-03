// database/migrations/YYYY_MM_DD_HHMMSS_add_spending_limits_to_users_table.php

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
            $table->decimal('weekly_limit', 10, 2)->default(0.00)->after('current_money');
            $table->decimal('weekly_spent_amount', 10, 2)->default(0.00)->after('weekly_limit');
            $table->timestamp('last_week_reset')->nullable()->after('weekly_spent_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['weekly_limit', 'weekly_spent_amount', 'last_week_reset']);
        });
    }
};