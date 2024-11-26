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
        Schema::create('guards', function (Blueprint $table) {
            $table->id();
            $table->string('fullname');
            $table->string('firstname');
            $table->string('genre');
            $table->date('date_of_birth');
            $table->string('nationality');
            $table->string('address');
            $table->string('city');
            $table->string('departement');
            $table->string('region');
            $table->string('typeADS');
            $table->string('email')->unique();
            $table->integer('phone');
            $table->bigInteger('social_security_number')->unique();
            $table->string('professional_card_number')->unique();
            $table->json('diplomas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guards');
    }
};
