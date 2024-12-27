<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();  // Colonne 'id' auto-incrémentée
            $table->string('name');  // Nom du client
            $table->string('manager_name');  // Nom du gestionnaire du client
            $table->string('email');  // Email unique
            $table->string('phone');  // Numéro de téléphone (nullable)
            $table->string('address');  // Adresse (nullable)
            $table->string('password');  // Mot de passe
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
