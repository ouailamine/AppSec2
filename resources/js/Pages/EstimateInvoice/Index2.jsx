import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
// Importation des pages Invoices et Estimate
import Invoices from "./Invoices";
import Estimate from "./Estimate2";

export default function DashboardAdmin({
  title = "Devis et Facture",
  plannings = [],
  sites = [],
  typePosts,
  Posts,
  holidays
}) {
  //console.log('type posts',typePosts)
 // console.log(Posts);
 // console.log(sites);

  const [activeSection, setActiveSection] = useState(""); // Par défaut, aucune section affichée
  const [selectedIdSite, setSelectedIdSite] = useState(""); // State pour le site sélectionné

  // Trouver le site correspondant à l'ID sélectionné
  const selectedSite = sites.find(
    (site) => site.id === parseInt(selectedIdSite)
  );

  // Utiliser useEffect pour afficher les props dans la console lorsque le composant est monté
  useEffect(() => {
    //console.log("Plannings:", plannings); // Afficher plannings dans la console
    //console.log("Sites:", sites); // Afficher sites dans la console
   // console.log("Site sélectionné:", selectedSite); // Afficher les détails du site sélectionné
  }, [plannings, sites, selectedSite]);

  // Fonction pour gérer la sélection du site
  const handleSiteChange = (e) => {
    setSelectedIdSite(e.target.value); // Met à jour le site sélectionné
  };

  // Fonction pour gérer la sélection du menu section (Devis ou Facture)
  const handleSectionChange = (e) => {
    setActiveSection(e.target.value);
    //console.log("Section sélectionnée:", e.target.value);
  };


  return (
    <AdminAuthenticatedLayout>
      <Head title="Dashboard Admin" />
      <div className="container mx-auto mt-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>

        {/* Conteneur pour les menus Select côte à côte */}
        <div className="flex items-center space-x-6 mb-6">
          {/* Menu Select pour le site */}
          <div>
            <label htmlFor="site-select" className="text-lg font-medium mr-2">
              Sélectionner un site:
            </label>
            <select
              id="site-select"
              value={selectedIdSite}
              onChange={handleSiteChange}
              className="w-30 border rounded-lg"
            >
              <option value="">Choisir un site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Select pour les sections */}
          <div>
            <label
              htmlFor="section-select"
              className="text-lg font-medium mr-2"
            >
              Sélectionner une section:
            </label>
            <select
              id="section-select"
              value={activeSection}
              onChange={handleSectionChange}
              className="w-30 border rounded-lg"
            >
              <option value="">Choisir une section</option>
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
            </select>
          </div>
          
        </div>

        {/* Section Devis */}
        {activeSection === "devis" && (
          <div className="mt-8 w-full">
            <Estimate 
            sites={sites} 
            selectedSite={selectedSite}
            typePosts={typePosts}
            posts={Posts}
            holidays={holidays}/> 
          </div>
        )}

        {/* Section Facture */}
        {activeSection === "facture" && (
          <div className="mt-8 w-full">
            <Invoices
              plannings={plannings}
              selectedSite={selectedSite}
              allTypePosts={typePosts}
              allPosts={Posts}
            />{" "}
            {/* Affiche le composant Invoices */}
          </div>
        )}
      </div>
    </AdminAuthenticatedLayout>
  );
}
