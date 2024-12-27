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

// Public Routes
Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth:customer'])->group(function () {
    Route::get('/accueil-Client', [CustomerPageController::class, 'index'])->name('dashboardCustomer');
});

Route::get('/accueil-Employé', [EmployeeController::class, 'index'])->name('dashboard');
// Authenticated Routes
Route::middleware(['auth'])->group(function () {


    Route::get('/planning agent', [EmployeeController::class, 'planningGuard'])->name('planningGuard');


    // Define the route for validating a planning
    Route::post('/plannings/validate', [PlanningController::class, 'validate'])->name('plannings.validate');

    

    // Dashboard Routes
    Route::middleware(['auth', 'verified'])->group(function () {

        

        Route::get('/dashboard-Admin', function () {
            // Calculer filteredUsersCount pour les admins
            $authController = new AuthenticatedSessionController(); // Instanciez le contrôleur

            $filteredUsersCount = $authController->getFilteredUsersCount();
            $filteredVacationsCount = $authController->getFilteredVacationsCount(); // Obtenir le nombre de vacances

            return Inertia::render('Admin/DashboardAdmin', [
                'filteredUsersCount' => $filteredUsersCount,
                'filteredVacationsCount' => $filteredVacationsCount // Passer le nombre de vacances à la vue
            ]);
        })->middleware('role:Admin')->name('dashboardAdmin');

        Route::get('/dashboard-Leader', function () {
            // Calculer filteredUsersCount pour les leaders
            $authController = new AuthenticatedSessionController(); // Instanciez le contrôleur

            $filteredUsersCount = $authController->getFilteredUsersCount();
            $filteredVacationsCount = $authController->getFilteredVacationsCount(); // Obtenir le nombre de vacances

            return Inertia::render('LeaderManager/DashboardLeader', [
                'filteredUsersCount' => $filteredUsersCount,
                'filteredVacationsCount' => $filteredVacationsCount // Passer le nombre de vacances à la vue
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

    // Site Routes
    Route::put('/sites/{site}/users', [SiteController::class, 'updateUsers'])->name('sites.updateUsers');

    // Guard Routes
    Route::post('/userss/{user}/create-user', [UserController::class, 'createUser'])->name('CreateUser');

    // User Routes
    Route::resource('users', UserController::class);

    // Guard Routes
    Route::resource('guards', GuardController::class);

    // Resource Routes
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
        'customers'=> CustomerController::class
    ]);
});

// Auth Routes
require __DIR__ . '/auth.php';
