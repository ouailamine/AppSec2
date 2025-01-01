<?php

use App\Http\Controllers\{
    CatchEvent\CatchEventController,
    Contrat\ContratController,
    Diploma\DiplomaController,
    Employee\EmployeeController,
    EstimateInvoice\EstimateInvoiceController,
    Guard\GuardController,
    Holiday\HolidayController,
    Incident\IncidentController,
    Permission\PermissionController,
    Planning\PlanningController,
    ProCard\ProCardController,
    ProfileController,
    Role\RoleController,
    Settings\SettingsController,
    Site\SiteController,
    Tasks\TasksController,
    TypeAds\TypeAdsController,
    TypePost\TypePostController,
    TypePost\PostController,
    User\UserController
};
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\CustomerPageController;
use App\Http\Controllers\HourlyReport\HourlyReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Customer Routes (Authenticated)
Route::middleware(['auth:customer'])->group(function () {
    Route::get('/accueil-Client', [CustomerPageController::class, 'index'])->name('dashboardCustomer');
});

// Employee Dashboard
Route::get('/accueil-Employé', [EmployeeController::class, 'index'])->name('dashboard');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {

    // Employee Dashboard and Search Routes
    Route::get('/accueil-Employé', [EmployeeController::class, 'index'])->name('dashboard');
    Route::post('/recherche-Agent', [UserController::class, 'searchUser'])->name('searchUser');
    Route::get('/planning agent', [EmployeeController::class, 'planningGuard'])->name('planningGuard');

    // Planning Validation Route
    Route::post('/plannings/validate', [PlanningController::class, 'validate'])->name('plannings.validate');

    // Admin and Leader Dashboards
    Route::middleware(['auth', 'verified'])->group(function () {

        // Admin Dashboard
        Route::get('/dashboard-Admin', function () {
            $authController = new AuthenticatedSessionController();
            $filteredUsersCount = $authController->getFilteredUsersCount();
            $filteredVacationsCount = $authController->getFilteredVacationsCount();

            return Inertia::render('Admin/DashboardAdmin', [
                'filteredUsersCount' => $filteredUsersCount,
                'filteredVacationsCount' => $filteredVacationsCount,
            ]);
        })->name('dashboardAdmin');

        // Leader Dashboard
        Route::get('/dashboard-Leader', function () {
            $authController = new AuthenticatedSessionController();
            $filteredUsersCount = $authController->getFilteredUsersCount();
            $filteredVacationsCount = $authController->getFilteredVacationsCount();

            return Inertia::render('LeaderManager/DashboardLeader', [
                'filteredUsersCount' => $filteredUsersCount,
                'filteredVacationsCount' => $filteredVacationsCount,
            ]);
        })->middleware('role:Admin|Leader|Manager')->name('dashboardLeader');
    });

    // Profile Routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Estimate & Invoice Routes
    Route::get('/devis-et-factures', [EstimateInvoiceController::class, 'index'])->name('estimateInvoice.index');

    // Task Routes
    Route::prefix('tasks')->group(function () {
        Route::get('/devis-et-factures', [TasksController::class, 'createDevisFactures'])->name('devisFactures');
        Route::get('/contrats', [TasksController::class, 'createDevisFactures'])->name('contrat');
        Route::get('/carte-pro', [TasksController::class, 'indexCartePro'])->name('cartePro');
    });

    // Search Routes
    Route::get('/search-employee', [UserController::class, 'index'])->name('user.index');
    Route::get('/search-guard', [GuardController::class, 'index'])->name('guard.index');

    // Settings Routes
    Route::prefix('settings')->group(function () {
        Route::get('/roles', [SettingsController::class, 'indexrole'])->name('role.index');
        Route::get('/permissions', [SettingsController::class, 'indexPermission'])->name('permission.index');
        Route::get('/diplomes', [SettingsController::class, 'indexDiplome'])->name('diplome.index');
    });

    // Site Routes
    Route::put('/client/{cunstomer}/sites', [CustomerController::class, 'updateSites'])->name('customers.updateSites');
    Route::put('/sites/{site}/users', [SiteController::class, 'updateUsers'])->name('sites.updateUsers');

    // User Routes
    Route::post('/userss/{user}/create-user', [UserController::class, 'createUser'])->name('CreateUser');
    Route::resource('users', UserController::class);

    // Guard Routes
    Route::resource('guards', GuardController::class);

    // Resource Routes for various entities
    Route::resources([
        'diplomas' => DiplomaController::class,
        'sites' => SiteController::class,
        'incidents' => IncidentController::class,
        'plannings' => PlanningController::class,
        'roles' => RoleController::class,
        'typeAds' => TypeAdsController::class,
        'permissions' => PermissionController::class,
        'contrats' => ContratController::class,
        'procards' => ProCardController::class,
        'typePosts' => TypePostController::class,
        'holidays' => HolidayController::class,
        'typeAgent' => HolidayController::class,
        'posts' => PostController::class,
        'HourlyReports' => HourlyReportController::class,
        'catchEvents' => CatchEventController::class,
        'customers' => CustomerController::class
    ]);
});

// Auth Routes
require __DIR__ . '/auth.php';
