import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
  className = "",
}) {
  const user = usePage().props.auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } =
    useForm({
      fullname: user.fullname,
      firstname: user.firstname,
      email: user.email,
      phone: user.phone,
    });

  const submit = (e) => {
    e.preventDefault();
    patch(route("profile.update"));
  };

  return (
    <section
      className={`${className} max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg`}
    >
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Informations du Profil
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Mettez à jour les informations de votre compte et votre adresse
          e-mail.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <InputLabel htmlFor="fullname" value="Nom complet" />

          <TextInput
            id="fullname"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-300"
            value={data.fullname}
            onChange={(e) => setData("fullname", e.target.value)}
            required
            autoComplete="name"
            disabled
          />

          <InputError className="mt-2" message={errors.fullname} />
        </div>

        <div>
          <InputLabel htmlFor="firstname" value="Prénom" />

          <TextInput
            id="firstname"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-300"
            value={data.firstname}
            onChange={(e) => setData("firstname", e.target.value)}
            required
            autoComplete="firstname"
            disabled
          />

          <InputError className="mt-2" message={errors.firstname} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="E-mail" />

          <TextInput
            id="email"
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            autoComplete="email"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        <div>
          <InputLabel htmlFor="phone" value="Téléphone" />

          <TextInput
            id="phone"
            type="tel"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            required
            autoComplete="tel"
          />

          <InputError className="mt-2" message={errors.phone} />
        </div>

        {mustVerifyEmail && user.email_verified_at === null && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
            <p className="text-sm text-gray-800">
              Votre adresse e-mail n’est pas vérifiée.
              <Link
                href={route("verification.send")}
                method="post"
                as="button"
                className="underline text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cliquez ici pour renvoyer l'e-mail de vérification.
              </Link>
            </p>

            {status === "verification-link-sent" && (
              <div className="mt-2 font-medium text-sm text-green-600">
                Un nouveau lien de vérification a été envoyé à votre adresse
                e-mail.
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mt-6">
          <PrimaryButton
            disabled={processing}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sauvegarder
          </PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            leave="transition-opacity duration-300"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">Enregistré.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
