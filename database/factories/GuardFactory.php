<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Diploma;
use App\Models\Nationality;
use App\Models\TypeAds;
use App\Models\City;
use App\Models\Region;
use App\Models\Departement;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guard>
 */
class GuardFactory extends Factory
{
    /**
     * Définissez l'état par défaut du modèle.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('fr_FR');

        // Récupérez les noms des diplômes depuis la base de données
        $diplomas = Diploma::all();
        if ($diplomas->isEmpty()) {
            throw new \Exception('La table des diplômes est vide.');
        }

        // Récupérez les nationalités depuis la base de données
        $nationalities = Nationality::pluck('name')->toArray();
        if (empty($nationalities)) {
            throw new \Exception('La table des nationalités est vide.');
        }

        // Récupérez les types d'annonces depuis la base de données
        $typeAds = TypeAds::pluck('name')->toArray();
        if (empty($typeAds)) {
            throw new \Exception('La table des types d\'annonces est vide.');
        }

        // Récupérez des villes, départements et régions depuis la base de données
        $cities = City::all();
        $departements = Departement::all();
        $regions = Region::all();

        // Validation des collections
        if ($cities->isEmpty() || $departements->isEmpty() || $regions->isEmpty()) {
            throw new \Exception('Les tables de données (cities, departements, regions) doivent contenir des données.');
        }

        // Choisir une région aléatoire
        $region = $faker->randomElement($regions);
        $regionCode = $region->region_code;

        // Trouver des départements pour la région choisie
        $filteredDepartements = $departements->where('region_code', $regionCode);

        // Si la région n'a pas de départements, choisir une autre région qui en a
        if ($filteredDepartements->isEmpty()) {
            $regionsWithDepartements = $departements->pluck('region_code')->unique();
            if ($regionsWithDepartements->isEmpty()) {
                throw new \Exception('Aucune région avec départements trouvée.');
            }
            $regionCode = $regionsWithDepartements->random();
            $filteredDepartements = $departements->where('region_code', $regionCode);
        }

        // Choisir un département aléatoire
        $departement = $filteredDepartements->random();
        $departementCode = $departement->departement_code;

        // Trouver des villes pour le département choisi
        $filteredCities = $cities->where('departement_code', $departementCode);

        // Si le département n'a pas de villes, choisir un autre département qui en a
        if ($filteredCities->isEmpty()) {
            $departementsWithCities = $cities->pluck('departement_code')->unique();
            if ($departementsWithCities->isEmpty()) {
                throw new \Exception('Aucun département avec villes trouvé.');
            }
            $departementCode = $departementsWithCities->random();
            $filteredCities = $cities->where('departement_code', $departementCode);
            $departement = $departements->where('departement_code', $departementCode)->first();
        }

        // Choisir une ville aléatoire
        $city = $filteredCities->random();

        // Générer une liste de diplômes avec des dates de fin (1 à 3 diplômes)
        $diplomasList = [];
        $numDiplomas = $faker->numberBetween(1, 3); // Nombre de diplômes aléatoire entre 1 et 3
        for ($i = 0; $i < $numDiplomas; $i++) {
            $diploma = $faker->randomElement($diplomas);
            $diplomasList[] = [
                'name' => $diploma->name,
                'end_date' => $faker->date(),
            ];
        }

        return [
            'fullname' => $faker->firstName(),
            'firstname' => $faker->lastName(),
            'date_of_birth' => $faker->date(),
            'genre' => $faker->randomElement(['Masculin', 'Féminin']),
            'nationality' => $faker->randomElement($nationalities),
            'typeADS' => $faker->randomElement($typeAds),
            'address' => $faker->streetAddress(),
            'city' => $city->name,
            'region' => $region->region_code,
            'departement' => $departement->departement_code,
            'phone' => $this->faker->numerify('0#########'), // French phone number format (10 digits)
            'social_security_number' => $faker->numerify('###########'), // French social security number format (11 digits)
            'professional_card_number' => $faker->numerify('0##-####-##-##-#############'),
            'email' => $faker->unique()->safeEmail(),
            'diplomas' => json_encode($diplomasList)
        ];
    }
}
