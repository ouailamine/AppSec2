import React, { useState, useEffect } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument"; // Importer le composant MyDocument

const CreateProCard = ({ users, user, auth, selectedUserId }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    firstname: "",
    date_of_birth: "",
    genre: "",
    address: "",
    city: "",
    departement: "",
    region: "",
    phone: "",
    social_security_number: "",
    professional_card_number: "",
    registerNumber: "",
    image: null,
    pdfName: "carte professionnelle",
  });

  // Track selected user
  const [currentUser, setCurrentUser] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        firstname: user.firstname || "",
        date_of_birth: user.date_of_birth || "",
        genre: user.genre || "",
        address: user.address || "",
        city: user.city || "",
        departement: user.departement || "",
        region: user.region || "",
        phone: user.phone || "",
        social_security_number: user.social_security_number || "",
        professional_card_number: user.professional_card_number || "",
        registerNumber: user.registerNumber || "",
        pdfName: `carte professionnelle ${user.fullname || ""}`,
      });
      setCurrentUser(user);
    }
  }, [user]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const selectedUser = users.find((u) => u.id.toString() === userId);

    if (selectedUser) {
      setFormData({
        fullname: selectedUser.fullname || "",
        firstname: selectedUser.firstname || "",
        date_of_birth: selectedUser.date_of_birth || "",
        genre: selectedUser.genre || "",
        address: selectedUser.address || "",
        city: selectedUser.city || "",
        departement: selectedUser.departement || "",
        region: selectedUser.region || "",
        phone: selectedUser.phone || "",
        social_security_number: selectedUser.social_security_number || "",
        professional_card_number: selectedUser.professional_card_number || "",
        registerNumber: selectedUser.registerNumber || "",
        pdfName: `carte professionnelle ${selectedUser.fullname || ""}`,
      });
      setCurrentUser(selectedUser);
    }

    setFileInputKey((prevKey) => prevKey + 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données du formulaire:", formData);
  };

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Créer une Carte Pro" />
      <div className="container mx-auto mt-4 px-4">
        <div className="mb-6 flex justify-center">
          <Link
            href={route("procards.index")}
            className="inline-flex items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-semibold"
          >
            Retour à la liste de validité des cartes professionnelles
          </Link>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">
            <h1 className="mb-4 text-2xl font-bold">Générer une carte pro</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="userDropdown"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sélectionner un utilisateur
                </label>
                <select
                  id="userDropdown"
                  value={currentUser?.id || ""}
                  onChange={handleUserChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <option value="">-- Sélectionner un utilisateur --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullname} {user.firstname}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Choisissez une image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  key={fileInputKey}
                  className="mt-1 block w-full text-sm text-gray-500 file:border file:border-gray-300 file:rounded-md file:p-2 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-center">
                <PDFDownloadLink
                  document={<MyDocument formData={formData} />}
                  fileName={`${formData.pdfName}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <span className="text-blue-600">
                        Chargement du document...
                      </span>
                    ) : (
                      <span className="text-blue-600 hover:underline">
                        Télécharger la carte en PDF
                      </span>
                    )
                  }
                </PDFDownloadLink>
              </div>
            </form>
          </div>

          <div className="w-full md:w-1/2 px-4 mt-8 md:mt-0">
            <h2 className="mb-4 text-xl font-semibold">Prévisualiser le PDF</h2>
            <div className="flex justify-center mb-3">
              <PDFViewer width="100%" height="600px">
                <MyDocument formData={formData} />
              </PDFViewer>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
};

export default CreateProCard;
