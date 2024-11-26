<?php

namespace Database\Seeders;

use App\Models\Contrat;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContratSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contrat::factory()->count(
            100
        )->create();
    }
}
