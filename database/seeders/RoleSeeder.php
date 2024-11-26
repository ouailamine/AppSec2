<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $Admin = Role::create(['name' => 'Admin']);
        $Leader = Role::create(['name' => 'Leader']);
        $Manager = Role::create(['name' => 'Manager']);
        $LeaderTeam = Role::create(['name' => 'LeaderTeam']);
        $Employee = Role::create(['name' => 'Employee']);

        $Admin->givePermissionTo([
            'create-role',
            'edit-role',
            'delete-role',
            'create-user',
            'edit-user',
            'delete-user',
            'create-guard',
            'edit-guard',
            'delete-guard',
        ]);

        $Leader->givePermissionTo([
            'create-role',
            'edit-role',
            'delete-role',
            'create-user',
            'edit-user',
            'delete-user',
            'create-guard',
            'edit-guard',
            'delete-guard',
        ]);

        $Manager->givePermissionTo([
            'create-user',
            'edit-user',
            'delete-user',
            'create-guard',
            'edit-guard',
            'delete-guard',
        ]);

        $LeaderTeam->givePermissionTo([
            'create-user',
            'edit-user',
            'delete-user',
            'create-guard',
            'edit-guard',
            'delete-guard',
        ]);
    }
}
