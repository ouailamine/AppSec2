<?php

namespace Database\Seeders;

use App\Models\TypeAds;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeAdsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $typesAds = [
            'Magasin',
            'Guardiennage',
            'Touts'



        ];

        // Looping and Inserting Array's Diplomas
        foreach ($typesAds as $typeAds) {
            TypeAds::create(['name' => $typeAds]);
        }
    }
}
