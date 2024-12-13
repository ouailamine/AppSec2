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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ajout de la colonne user_id
            $table->string('userName')->nullable();
            $table->foreignId('planning_id')->constrained()->onDelete('cascade'); // Ajout de la colonne planning_id
            $table->foreignId('site_id')->constrained()->onDelete('cascade'); // Ajout de la colonne site_id
            $table->string('month');
            $table->string('year');
            $table->string('post')->nullable();
            $table->string('postName')->nullable();
            $table->string('typePost')->nullable();
            $table->time('vacation_start')->nullable();
            $table->time('vacation_end')->nullable();
            $table->string('pause_payment')->nullable();
            $table->time('pause_start')->nullable();
            $table->time('pause_end')->nullable();
            $table->date('selected_days');
            $table->integer('lunchAllowance')->default(0);  // Default 0 (you could set it to 1 if needed)
            $table->integer('work_duration')->nullable();   // Nullable field to store duration in minutes
            $table->integer('night_hours')->nullable();     // Nullable field to store night hours in minutes
            $table->integer('sunday_hours')->nullable();    // Nullable field to store Sunday hours in minutes
            $table->integer('holiday_hours')->nullable();
            $table->boolean('isSubEvent')->default(false);
            $table->foreignId('relatedEvent')->nullable()->constrained('events')->onDelete('set null');

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
