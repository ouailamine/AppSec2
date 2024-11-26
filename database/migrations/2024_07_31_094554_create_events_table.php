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
        $table->foreignId('planning_id')->constrained()->onDelete('cascade'); // Ajout de la colonne planning_id
        $table->foreignId('site_id')->constrained()->onDelete('cascade'); // Ajout de la colonne site_id
        $table->string('month');
        $table->string('year');
        $table->string('post')->nullable();
        $table->string('typePost')->nullable();
        $table->time('vacation_start')->nullable();
        $table->time('vacation_end')->nullable();
        $table->string('pause_payment')->nullable();
        $table->time('pause_start')->nullable();
        $table->time('pause_end')->nullable();
        $table->date('selected_days');
        $table->string('lunchAllowance');
        $table->string('work_duration')->nullable();
        $table->string('night_hours')->nullable();
        $table->string('sunday_hours')->nullable();  
        $table->string('holiday_hours')->nullable();  
        $table->boolean('isSubEvent')->default(false); 
        $table->foreignId('relatedEventId')->nullable()->constrained('events')->onDelete('set null');
        
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
