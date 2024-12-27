import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
    actor: "", // Valeur par défaut pour le menu déroulant
  });

  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const validateFields = () => {
    const fieldErrors = {};
    if (!data.actor) fieldErrors.actor = "Veuillez sélectionner une option.";
    if (!data.email) fieldErrors.email = "L'email est obligatoire.";
    if (!data.password) fieldErrors.password = "Le mot de passe est obligatoire.";
    return fieldErrors;
  };

  const submit = (e) => {
    e.preventDefault();

    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setClientErrors(fieldErrors);
      return;
    }

    post(route("login"));
  };

  return (
    <GuestLayout>
      <Head title="Connecter" />

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <div className="flex flex-row items-center justify-center mb-5 space-x-5">
          <img
            src="assets/img/AppSec.png"
            className="w-32 h-32 rounded-full object-cover"
          />
          <img src="logo.png" className="w-32 h-32 rounded-full object-cover" />
        </div>

        {/* Nouveau menu déroulant */}
        <div className="mb-2 w-40 mx-auto">
          <InputLabel htmlFor="actor" value="Vous êtes :" />
          <select
            id="actor"
            name="actor"
            value={data.actor}
            onChange={(e) => {
              setData("actor", e.target.value);
              setClientErrors((prev) => ({ ...prev, actor: null }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">-- Choisir --</option>
            <option value="customer">Client</option>
            <option value="employee">Employé</option>
          </select>
          {clientErrors.actor && <InputError message={clientErrors.actor} className="mt-2" />}
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
            onChange={(e) => {
              setData("email", e.target.value);
              setClientErrors((prev) => ({ ...prev, email: null }));
            }}
          />

          {clientErrors.email && <InputError message={clientErrors.email} className="mt-2" />}
        </div>

        <div className="mt-2">
          <InputLabel htmlFor="password" value="Mot de passe" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="current-password"
            onChange={(e) => {
              setData("password", e.target.value);
              setClientErrors((prev) => ({ ...prev, password: null }));
            }}
          />

          {clientErrors.password && <InputError message={clientErrors.password} className="mt-2" />}
        </div>

        <div className="block mt-4">
          <label className="flex items-center">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setData("remember", e.target.checked)}
            />
            <span className="ms-2 text-sm text-gray-600">
              Souviens-toi de moi
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end mt-4">
          {
            <Link
              href={route("password.request")}
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mot de passe oublié ?
            </Link>
          }

          <PrimaryButton className="ms-4" disabled={processing}>
            Connecter
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
