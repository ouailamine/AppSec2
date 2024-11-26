<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Site;

class SiteFactory extends Factory
{
    protected $model = Site::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company, // Random company name for the site
            'manager_name' => $this->faker->name, // Random name for the site manager
            'address' => $this->faker->address, // Random address
            'email' => $this->faker->unique()->safeEmail, // Unique random email address
            'phone' => $this->faker->numerify('0#########'), // Random phone number
            // Ne pas inclure 'users' car cette colonne n'existe pas dans la table
        ];
    }
}
