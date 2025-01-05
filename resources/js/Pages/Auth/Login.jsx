import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

const Login=({ message, personEmail }) =>{
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
    actor: "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [showMessage, setShowMessage] = useState(true);
  const [isActorMenuHidden, setIsActorMenuHidden] = useState(false);

  useEffect(() => {
    if (personEmail) {
      setData("email", personEmail);
    }
  }, [personEmail, setData]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // 5 seconds delay before hiding the message

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  useEffect(() => {
    if (errors.email) {
      setClientErrors((prev) => ({ ...prev, email: errors.email }));
    }
    if (errors.password) {
      setClientErrors((prev) => ({ ...prev, password: errors.password }));
    }
    if (errors.actor) {
      setClientErrors((prev) => ({ ...prev, actor: errors.actor }));
    }
  }, [errors]);

  const validateFields = () => {
    const fieldErrors = {};
    if (!data.actor) fieldErrors.actor = "Veuillez sélectionner une option.";
    if (!data.email) fieldErrors.email = "L'email est obligatoire.";
    if (!data.password)
      fieldErrors.password = "Le mot de passe est obligatoire.";
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

  const handleDoubleClick = () => {
    setIsActorMenuHidden(true);
    setData("actor", "Admin");
  };

  return (
    <GuestLayout>
      <Head title="Connecter" />

      {showMessage && message && (
        <div className="mb-4 p-4 rounded-lg text-sm text-blue-700 bg-blue-100 border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
          {message}
        </div>
      )}
      <form onSubmit={submit}>
        <div className="flex flex-row items-center justify-center mb-5 space-x-5">
          <img
            src="assets/img/AppSec.png"
            className="w-32 h-32 rounded-full object-cover cursor-pointer"
            onDoubleClick={handleDoubleClick}
          />
          <img src="logo.png" className="w-32 h-32 rounded-full object-cover" />
        </div>

        {/* Dropdown or Admin Message */}
        {!isActorMenuHidden ? (
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
            {clientErrors.actor && (
              <InputError message={clientErrors.actor} className="mt-2" />
            )}
          </div>
        ) : (
          <div>
            <p className="text-center text-red-600 font-bold mb-1">Vous êtes  en mode administrateur.</p>
            <p className="text-center text-xs text-red-500 font-bold mb-2">Actualiser la page pour revenir au mode normale</p>
          </div>
        )}

        {/* Email input field */}
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
          {clientErrors.email && (
            <InputError message={clientErrors.email} className="mt-2" />
          )}
        </div>

        {/* Password input field */}
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
          {clientErrors.password && (
            <InputError message={clientErrors.password} className="mt-2" />
          )}
        </div>

        {/* Remember me checkbox */}
        {!isActorMenuHidden && (
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
        </div>)}

        {/* Action buttons */}
        
        <div className="flex items-center justify-end mt-4">
          {/* Password reset link */}
          {!isActorMenuHidden && (
          <Link
            href={route("password.request")}
            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mot de passe oublié ?
          </Link>)}

          <PrimaryButton className="ms-4" disabled={processing}>
            {processing ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6l4 2m-4-2l-4 2"
                />
              </svg>
            ) : null}
            {processing ? "Chargement..." : "Connecter"}
          </PrimaryButton>
        </div>
        
      </form>
    </GuestLayout>
  );
}

export default Login ;