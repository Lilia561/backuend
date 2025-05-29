<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail; // Keep commented unless you implement email verification
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Add this line for Laravel Sanctum

class User extends Authenticatable
{
    // Add HasApiTokens to the use statement for Sanctum functionality
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'contact_number', // Changed from 'name' to 'contact_number' as your primary unique identifier
        'email',
        'password',
        'name'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Ensures password is automatically hashed when set
        ];
    }
}
