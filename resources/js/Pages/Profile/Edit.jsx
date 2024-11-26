import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, user }) {



    console.log(auth)
  // Vérifiez le rôle de l'utilisateur
  const Layout = auth.user.roles === 'employee' ? AuthenticatedLayout : AdminAuthenticatedLayout;

  return (
    <Layout
      user={auth.user}
      //header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profil</h2>}
    >
      <Head title="Profil" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations du Profil
            </h3>
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl mx-auto"
            />
          </div>

          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier le Mot de Passe
            </h3>
            <UpdatePasswordForm className="max-w-xl mx-auto" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
