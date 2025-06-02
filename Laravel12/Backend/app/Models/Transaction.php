<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',          // Keep this for existing components
        'sender_id',        // NEW: Foreign key for the sender
        'receiver_id',      // NEW: Foreign key for the receiver
        'transaction_date',
        'amount_spent',     // Keep this for existing components
        'product_id',
        'description',
        'status',           // NEW: e.g., 'completed', 'pending', 'failed'
    ];

    /**
     * Get the user that owns the transaction (original user_id relationship).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Explicitly link to user_id
    }

    /**
     * Get the user who sent the transaction.
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the user who received the transaction.
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    /**
     * Get the product type associated with the transaction.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
