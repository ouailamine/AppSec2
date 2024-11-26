<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Diploma;
use App\Models\Nationality;
use App\Models\TypeAds;
use App\Models\City;
use App\Models\Region;
use App\Models\Departement;
use App\Models\Genre;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('fr_FR'); // Use French locale for names and data

        // Fetch necessary data
        $diplomas = Diploma::all();
        $nationalities = Nationality::pluck('name')->toArray();
        $typeAds = TypeAds::pluck('name')->toArray();
        $cities = City::all();
        $departements = Departement::all();
        $regions = Region::all();
        $genres = Genre::pluck('name')->toArray(); // Retrieve genres

        // Validate data availability
        if ($diplomas->isEmpty() || empty($nationalities) || empty($typeAds) || $cities->isEmpty() || $departements->isEmpty() || $regions->isEmpty() || empty($genres)) {
            throw new \Exception('One or more required tables are empty.');
        }

        // Choose a random region
        $region = $this->faker->randomElement($regions);
        $regionCode = $region->region_code;

        // Find departments for the chosen region
        $filteredDepartements = $departements->where('region_code', $regionCode);

        // If no departments in the chosen region, select another region
        if ($filteredDepartements->isEmpty()) {
            $region = $this->faker->randomElement($regions->filter(fn ($r) => $departements->where('region_code', $r->region_code)->isNotEmpty()));
            $regionCode = $region->region_code;
            $filteredDepartements = $departements->where('region_code', $regionCode);
        }

        // Choose a random department
        $departement = $this->faker->randomElement($filteredDepartements);
        $departementCode = $departement->departement_code;

        // Find cities for the chosen department
        $filteredCities = $cities->where('departement_code', $departementCode);

        // If no cities in the chosen department, select another department
        if ($filteredCities->isEmpty()) {
            $departement = $this->faker->randomElement($departements->filter(fn ($d) => $cities->where('departement_code', $d->departement_code)->isNotEmpty()));
            $departementCode = $departement->departement_code;
            $filteredCities = $cities->where('departement_code', $departementCode);
        }

        // Choose a random city
        $city = $this->faker->randomElement($filteredCities);

        // Generate a list of diplomas for this user with end dates
        $userDiplomas = [];
        $numDiplomas = $this->faker->numberBetween(1, 3); // Random number of diplomas between 1 and 3
        $diplomasNames = $diplomas->pluck('name')->toArray();

        for ($i = 0; $i < $numDiplomas; $i++) {
            $diplomaName = $this->faker->randomElement($diplomasNames);
            $endDate = $this->faker->date; // Random end date
            $userDiplomas[] = [
                'name' => $diplomaName,
                'end_date' => $endDate,
            ];
        }

        return [
            'fullname' => $faker->name, // Full name in French
            'firstname' => $faker->firstName, // First name in French
            'date_of_birth' => $faker->date,
            'genre' => $this->faker->randomElement($genres),
            'nationality' => $this->faker->randomElement($nationalities),
            'address' => $faker->streetAddress(),
            'city' => $city->name,
            'departement' => $departementCode,
            'region' => $regionCode,
            'phone' => $this->faker->numerify('0#########'), // French phone number format (10 digits)
            'social_security_number' => $faker->numerify('###########'), // French social security number format (11 digits)
            'professional_card_number' => $faker->numerify('0##-####-##-##-#############'),
            'diplomas' => json_encode($userDiplomas), // List of diplomas in JSON
            'typeAds' => $this->faker->randomElement($typeAds),
            'email' => $faker->unique()->safeEmail,
            'password' => Hash::make('atalixsecurite'),
            'note' => $faker->numberBetween(0, 10),
            'registerNumber' => $faker->unique()->numerify('####'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
