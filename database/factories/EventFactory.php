<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Event;
use App\Models\Planning;
use App\Models\User;
use App\Models\Post;
use App\Models\Site;

class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Define the available years
        $years = [2024, 2025];

        // Pick a random year
        $year = $this->faker->randomElement($years);

        // Generate a random date within the selected year
        $date = $this->faker->dateTimeBetween("$year-01-01", "$year-12-31")->format('Y-m-d');

        // Generate start and end times within the same day
        $startDateTime = $this->faker->dateTimeBetween("$date 00:00", "$date 23:59");
        $endDateTime = $this->faker->dateTimeBetween($startDateTime, "$date 23:59");

        // Ensure end time is after start time
        $startTime = $startDateTime->format('Y-m-d H:i:s');
        $endTime = $endDateTime->format('Y-m-d H:i:s');

        // Calculate the difference in hours between vacation_start and vacation_end
        $diffInSeconds = $endDateTime->getTimestamp() - $startDateTime->getTimestamp();
        $diffInHours = round($diffInSeconds / 3600, 2); // Convert seconds to hours and round to 2 decimal places

        // Generate hours and minutes for night_hours, sunday_hours, and holiday_hours
        // Format: H:i, with hours <= 12 and minutes <= 59
        $generateTime = function () {
            $hours = $this->faker->numberBetween(0, 12); // Hours between 0 and 12
            $minutes = $this->faker->numberBetween(0, 59); // Minutes between 0 and 59
            return sprintf('%02d:%02d', $hours, $minutes); // Format as H:i
        };

        // Predefined values for typePost
        $posts = Post::pluck('abbreviation')->toArray();
        if (empty($posts)) {
            throw new \Exception('La table des types d\'annonces est vide.');
        }

        // Possible values for pause_payment
        $pausePayments = ['Payable', 'Non-payable'];

        // Generate a random date within the range of vacation_start and vacation_end for selected_days
        $selectedDay = $this->faker->dateTimeBetween($startDateTime, $endDateTime)->format('Y-m-d');

        return [
            'user_id' => User::inRandomOrder()->first()->id, // Assign a random existing user ID
            'planning_id' => Planning::inRandomOrder()->first()->id,
            'site_id' => Site::inRandomOrder()->first()->id,
            'vacation_start' => $startTime, // Full datetime format
            'vacation_end' => $endTime, // Full datetime format
            'pause_start' => $startTime, // Full datetime format
            'pause_end' => $endTime, // Full datetime format
            'work_duration' => $diffInHours . ' hours', // Duration in hours with " hours" suffix
            'night_hours' => $generateTime(), // Generate time in H:i format, max 12:59
            'sunday_hours' => $generateTime(), // Generate time in H:i format, max 12:59
            'holiday_hours' => $generateTime(), // Generate time in H:i format, max 12:59
            'post' => $this->faker->randomElement($posts), // Randomly select from predefined values
            'pause_payment' => $this->faker->randomElement($pausePayments), // Randomly select 'Payable' or 'Non-payable'
            'selected_days' => $selectedDay, // Single date within the event's range
        ];
    }
}
