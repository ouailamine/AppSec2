<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Creating Admin User
        $Admin = User::create([
            'fullname' => 'ouail',
            'firstname' => 'amine',
            'genre' => 'Masculin',
            'date_of_birth' => null,
            'address' => 'Montpellier',
            'nationality' => 'Francaise',
            'city' => 'Montpellier',
            'region' => 'occitanie',
            'departement' => 'hérault',
            'email' => 'ouailamin84@gmail.com',
            'phone' => 767088696,
            'social_security_number' => 1841199352560,
            'professional_card_number' => '034-2026-12-12-12345678912',
            'typeAds' => null,
            'note' => 10,
            'registerNumber' => 0,
            'diplomas' => null,
            'password' => Hash::make('atalixsecurite')
        ]);
        $Admin->assignRole('Admin');


        // Creating Manager User
        $Manager = User::create([
            'fullname' => 'manager',
            'firstname' => 'manager',
            'genre' => 'Masculin',
            'date_of_birth' => null,
            'address' => 'Montpellier',
            'nationality' => 'Francaise',
            'city' => 'Montpellier',
            'region' => 'occitanie',
            'departement' => 'hérault',
            'email' => 'manager@a.com',
            'phone' => 767088696,
            'social_security_number' => 1841199352550,
            'professional_card_number' => '034-2026-12-12-12345678901',
            'typeAds' => null,
            'note' => 10,
            'registerNumber' => 0,
            'diplomas' => null,
            'password' => Hash::make('atalixsecurite')
        ]);
        $Manager->assignRole('Manager');

        // Creating Manager User
        $LeaderTeam = User::create([
            'fullname' => 'LeaderTeam',
            'firstname' => 'LeaderTeam',
            'genre' => 'Masculin',
            'date_of_birth' => null,
            'address' => 'Montpellier',
            'nationality' => 'Francaise',
            'city' => 'Montpellier',
            'region' => 'occitanie',
            'departement' => 'hérault',
            'email' => 'LeaderTeam@a.com',
            'phone' => 767088696,
            'social_security_number' => 1841199352566,
            'professional_card_number' => '034-2026-12-12-12345678903',
            'typeAds' => null,
            'note' => 10,
            'registerNumber' => 0,
            'diplomas' => null,
            'password' => Hash::make('atalixsecurite')
        ]);
        $LeaderTeam->assignRole('LeaderTeam');
    }
}
