<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGuardDiplomaTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('guard_diploma', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('guard_id')->constrained()->onDelete('cascade'); // Foreign key to guards table
            $table->foreignId('diploma_id')->constrained()->onDelete('cascade'); // Foreign key to diplomas table
            $table->timestamps(); // Optional: created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('guard_diploma');
    }
}
