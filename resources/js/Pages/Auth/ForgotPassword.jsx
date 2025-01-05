import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
  // Initialize form state using Inertia's useForm hook
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    actor: "", // Add actor field to form state
  });

  // Handle form submission
  const submit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    post(route("password.email")); // Post form data to the route
  };

  return (
    <GuestLayout>
  <Head title="Forgot Password" />

  <div className="mb-6 text-sm text-gray-600 text-center">
    <p>
      Mot de passe oublié? <br />
      Aucun problème. <br />
      Laissez-nous simplement votre adresse e-mail et nous vous enverrons un mot de passe provisoire qui
      vous permettra de vous connecter et d’en choisir un nouveau.
    </p>
  </div>

  {/* Display status message if available */}
  {status && (
    <div className="mb-6 font-medium text-sm text-green-600">{status}</div>
  )}

  <form onSubmit={submit} className="space-y-4">
    {/* Actor Dropdown */}
    <div className="mb-4 w-full max-w-xs mx-auto">
      <label htmlFor="actor" className="block text-sm font-medium text-gray-700">
        Vous êtes :
      </label>
      <select
        id="actor"
        name="actor"
        value={data.actor}
        onChange={(e) => setData("actor", e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        required
      >
        <option value="">-- Choisir --</option>
        <option value="customer">Client</option>
        <option value="employee">Employé</option>
      </select>
      {errors.actor && <InputError message={errors.actor} className="mt-2" />}
    </div>

    {/* Email Input */}
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Adresse e-mail
      </label>
      <TextInput
        id="email"
        type="email"
        name="email"
        value={data.email}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        isFocused={true}
        onChange={(e) => setData("email", e.target.value)}
      />
      {/* Display input error message if there are any */}
      <InputError message={errors.email} className="mt-2" />
    </div>

    {/* Submit Button */}
    <div className="flex justify-center mt-6">
      <PrimaryButton className="w-full sm:w-auto" disabled={processing}>
        Envoyer un mot de passe provisoire
      </PrimaryButton>
    </div>
  </form>
</GuestLayout>

  );
}
