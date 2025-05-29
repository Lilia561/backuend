<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    // Add 'register' and 'login' to the paths array.
    // You can also use a wildcard like '*' to allow all routes,
    // but it's generally better to be specific for security.
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'register', 'login'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3075'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 100,

    'supports_credentials' => true,

];
