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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('fullname');
            $table->string('firstname');
            $table->string('genre');
            $table->date('date_of_birth')->nullable();
            $table->string('nationality');
            $table->string('address');
            $table->string('city');
            $table->string('departement');
            $table->string('region');
            $table->integer('phone');
            $table->bigInteger('social_security_number')->unique();
            $table->string('professional_card_number')->unique();;
            $table->string('typeADS')->nullable();
            $table->json('diplomas')->nullable();
            $table->string('email')->unique();
            $table->string('password');
            $table->integer('note')->nullable();;
            $table->integer('registerNumber');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
