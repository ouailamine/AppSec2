<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Incident;
use App\Models\Event;

class IncidentFactory extends Factory
{
    protected $model = Incident::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate random start and end times within the same day
        $startTime = $this->faker->time('H:i');
        $endTime = $this->faker->time('H:i', 'now');

        // Ensure end time is after start time
        if ($endTime <= $startTime) {
            $endTime = date('H:i', strtotime($startTime) + $this->faker->numberBetween(3600, 7200)); // Add 1 to 2 hours
        }

        // Define possible values for 'type'
        $types = ['sûreté', 'sécurité incendie', 'urgence technique', 'secours'];

        return [
            'start_time' => $startTime,
            'end_time' => $endTime,
            'type' => $this->faker->randomElement($types), // Randomly select from predefined types
            'description' => $this->faker->sentence, // Generate a random description
            'isClose' => $this->faker->boolean, // Randomly true or false
            'event_id' => Event::inRandomOrder()->first()->id, // Assign a random existing event ID
        ];
    }
}
