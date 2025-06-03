<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'message',
    ];

    /**
     * Get the user that owns the feedback.
     * Defines a one-to-many inverse relationship (a feedback belongs to one user).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
