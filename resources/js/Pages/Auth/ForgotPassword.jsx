import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
  // Initialize form state using Inertia's useForm hook
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  // Handle form submission
  const submit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    post(route("password.email")); // Post form data to the route
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="mb-4 text-sm text-gray-600">
        Mot de passe oublié? Aucun problème. Laissez-nous simplement votre
        adresse e-mail et nous vous enverrons un mot de passe provisoire qui
        vous permettra de vous connecter et d’en choisir un nouveau.
      </div>

      {/* Display status message if available */}
      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <TextInput
          id="email"
          type="email"
          name="email"
          value={data.email}
          className="mt-1 block w-full"
          isFocused={true}
          onChange={(e) => setData("email", e.target.value)}
        />

        {/* Display input error message if there are any */}
        <InputError message={errors.email} className="mt-2" />

        <div className="flex items-center justify-end mt-4">
          <PrimaryButton className="ms-4" disabled={processing}>
            Envoyer un mot de passe provisoire
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
