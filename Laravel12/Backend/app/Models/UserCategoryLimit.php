<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCategoryLimit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id', // or 'category_name' if not using a separate categories table
        'limit_amount',
        'current_spent_amount',
    ];

    /**
     * Get the user that owns the category limit.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the limit belongs to.
     * Only if you created a separate Category model/table
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}