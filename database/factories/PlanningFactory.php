<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Planning;
use App\Models\User;
use App\Models\Site;

class PlanningFactory extends Factory
{
    protected $model = Planning::class;

    public function definition()
    {
         // Les années disponibles
         $years = [2024, 2025];
        
         return [
             'site_id' => Site::inRandomOrder()->first()->id, // Associe un site aléatoire
             'year' => $this->faker->randomElement($years), // Sélectionne aléatoirement entre 2024 et 2025
             'month' => $this->faker->numberBetween(1, 12), // Génère un mois aléatoire (1-12)
             'isValidate' => $this->faker->boolean, // Génère un booléen aléatoire
         ];
    }
}
