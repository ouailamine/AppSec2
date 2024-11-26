<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Contrat;
use App\Models\User;

class ContratFactory extends Factory
{
    protected $model = Contrat::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Randomly choose between CDI and CDD
        $typeContrat = $this->faker->randomElement(['CDI', 'CDD']);
        
        // If the type is CDD, generate an end date
        $endDate = $typeContrat === 'CDD' ? $this->faker->dateTimeBetween('+1 week', '+1 year')->format('Y-m-d') : null;
        
        // Array of predefined typePost values
        $typePostOptions = ['Ads', 'SSIAP1', 'SSIAP2', 'SSIAP3', 'Cynophile'];
        
        return [
            'user_id' => User::inRandomOrder()->first()->id, // Assign a random existing user ID
            'typeContrat' => $typeContrat,
            'typePost' => $this->faker->randomElement($typePostOptions), // Randomly choose from predefined options
            'start' => $this->faker->date, // Generate a random start date
            'end' => $endDate, // Assign the end date if CDD, otherwise null
        ];
    }
}
