<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Get the limits for the category.
     */
    public function userCategoryLimits()
    {
        return $this->hasMany(UserCategoryLimit::class);
    }
}