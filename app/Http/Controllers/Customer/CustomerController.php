<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CustomerController extends Controller
{
   // Display a listing of the customers.
   public function index()
   {
    $customers = Customer::with('sites')->get();
    $sites = Site::all();
    return Inertia::render('Customer/Index', [
        'customers' =>$customers,
        'sites'=>$sites
    ]);
   }

   // Show the form for creating a new customer.
   public function create()
   {
       return view('customers.create'); // Return the view to create a customer
   }

   // Store a newly created customer in the database.
   public function store(Request $request)
{
    
    // Default password if no password is provided
    $defaultPassword = Hash::make('atalixsecurite');

    // Validate the request data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'manager_name' => 'required|string|max:255',
        'address' => 'required|string|max:500',
        'email' => 'required|email|unique:customers,email',  
        'phone' => 'required|string|max:20',  
    
    ]);

    try {
        // Create the customer record
        $customer = Customer::create([
            'name' => $request->name,
            'manager_name' => $request->manager_name,
            'address' => $request->address,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $defaultPassword,  // Set the default password
        ]);

        // Redirect back with a success message
        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');

    } catch (\Exception $e) {
        // Log the exception if needed
        

        // Redirect back with an error message
        return redirect()->route('customers.index')->with('error', 'An error occurred while creating the customer.');
    }
}


   // Display the specified customer.
   public function show($id)
   {
       $customer = Customer::findOrFail($id); // Find the customer by ID
       return view('customers.show', compact('customer')); // Return to the view with the customer data
   }

   // Show the form for editing the specified customer.
   public function edit($id)
   {
       $customer = Customer::findOrFail($id); // Find the customer by ID
       return view('customers.edit', compact('customer')); // Return the view to edit the customer
   }

   // Update the specified customer in the database.
   public function update(Request $request, $id)
   {
       $validated = $request->validate([
           'name' => 'required|string|max:255',
           'email' => 'required|email|unique:customers,email,' . $id,
           'phone' => 'required|string|max:20',
           // Add other fields here with their validation rules
       ]);

       // Find the customer and update their data
       $customer = Customer::findOrFail($id);
       $customer->update($validated);

       // Redirect back with a success message
       return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
   }

   // Remove the specified customer from the database.
   public function destroy($id)
   {
       $customer = Customer::findOrFail($id);
       $customer->delete(); // Delete the customer

       // Redirect back with a success message
       return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
   }


   public function updateSites(Request $request, $customerId)
{
  
    // Récupérer les IDs des sites depuis la requête (array des IDs des sites à mettre à jour)
    $customerSites = $request->input('customerSites', []);

    // S'assurer que le tableau n'est pas vide
    if (!empty($customerSites)) {
        // Mettre à jour les sites dont l'ID est dans le tableau customerSites
        Site::whereIn('id', $customerSites)
            ->update(['customer_id' => $customerId]);
    }

    // Retourner avec un message de succès
    return redirect()->back()->with('success', 'Liste des sites modifiée.');
}
}
