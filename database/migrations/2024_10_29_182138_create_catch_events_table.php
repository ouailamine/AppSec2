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
        Schema::create('catch_events', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key referencing users table
            $table->string('post'); // String field for post
            $table->foreignId('site_id')->constrained()->onDelete('cascade'); // Foreign key referencing sites table
            $table->string('sunday_hours')->nullable(); // VARCHAR for hours worked on Sundays
            $table->string('holiday_hours')->nullable(); // VARCHAR for hours worked on holidays
            $table->string('night_hours')->nullable(); // VARCHAR for night hours worked
            $table->string('hours')->nullable(); // VARCHAR for total hours
            $table->date('date_vacation'); // Date for vacation
            $table->date('date_regularization')->nullable();
            $table->integer('lunchAllowance');
            $table->string('managerCreate'); // Foreign key referencing the users table for manager
            $table->string('managerValidate')->nullable();;
            $table->boolean('isBilled')->default(false);
            $table->boolean('isRuler')->default(false); // Boolean to indicate if the user is a ruler
            $table->timestamps(); // Created at and updated at fields
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catch_events');
    }
};
