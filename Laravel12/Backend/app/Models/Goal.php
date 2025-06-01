<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'purpose',
        'target_balance',
        'current_progress',
        'target_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'target_date' => 'date',
        'target_balance' => 'decimal:2',
        'current_progress' => 'decimal:2',
    ];

    /**
     * Get the user that owns the goal.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

