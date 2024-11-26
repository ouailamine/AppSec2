import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const AddHoursModal = ({
  isOpen,
  onClose,
  users = [],
  posts = [],
  sites = [],
  event,
}) => {
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [post, setPost] = useState("");
  const [vacationDate, setVacationDate] = useState("");
  const [nightHours, setNightHours] = useState(0);
  const [hours, setHours] = useState(0);
  const [sundayHours, setSundayHours] = useState(0);
  const [holidayHours, setHolidayHours] = useState(0);
  const [lunchAllowance, setLunchAllowance] = useState(0); // New state for lunch allowance
  const [dateRegularization, setDateRegularization] = useState("");
  const [managerValidate, setManagerValidate] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBilled, setIsBilled] = useState(false); // Change to boolean

  const editMode = Boolean(event);

  useEffect(() => {
    if (editMode && event) {
      setSelectedAgent(event.user_id || "");
      setSelectedSite(event.site_id || "");
      setPost(event.post || "");
      setVacationDate(event.date_vacation || "");
      setHours(event.hours || 0);
      setNightHours(event.nightHours || 0);
      setSundayHours(event.sundayHours || 0);
      setHolidayHours(event.holidayHours || 0);
      setLunchAllowance(event.lunchAllowance || 0); // Set the lunch allowance if in edit mode
      setDateRegularization(event.date_regularization || "");
      setManagerValidate(event.managerValidate || "");
      setCreatedAt(event.created_at || "");
      setIsBilled(event.isBilled === 1); // Expecting 1 or 0 from backend
    } else {
      resetForm();
    }
  }, [event, editMode]);

  const resetForm = () => {
    setSelectedAgent("");
    setSelectedSite("");
    setPost("");
    setVacationDate("");
    setHours(0);
    setNightHours(0);
    setSundayHours(0);
    setHolidayHours(0);
    setLunchAllowance(0); // Reset lunch allowance
    setDateRegularization("");
    setManagerValidate("");
    setCreatedAt("");
    setIsBilled(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      user_id: selectedAgent,
      site_id: selectedSite,
      post,
      vacationDate,
      hours: parseFloat(hours),
      nightHours: parseFloat(nightHours),
      sundayHours: parseFloat(sundayHours),
      holidayHours: parseFloat(holidayHours),
      lunchAllowance: parseFloat(lunchAllowance), // Include lunch allowance in form data
      date_regularization: dateRegularization,
      managerValidate,
      created_at: createdAt,
      isBilled: isBilled ? 1 : 0, // Convert boolean to integer
    };

    try {
      if (editMode) {
        await Inertia.put(route("catchEvents.update", event.id), formData);
      } else {
        await Inertia.post(route("catchEvents.store"), formData);
      }
      onClose();
    } catch (error) {
      console.error("Submission failed: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {editMode ? "Modifier les heures" : "Ajouter des heures"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="site"
              >
                Sélectionner un site
              </label>
              <select
                id="site"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Choisir un site...</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="agent"
              >
                Sélectionner l'agent
              </label>
              <select
                id="agent"
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Choisir un agent...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname} {user.firstname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="vacationDate"
              >
                Date de la vacation
              </label>
              <input
                type="date"
                id="vacationDate"
                value={vacationDate}
                onChange={(e) => setVacationDate(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
              />
            </div>
            <div className="mb-4 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="isBilled"
              >
                Facturé
              </label>
              <select
                id="isBilled"
                value={isBilled ? "true" : "false"} // Display as string
                onChange={(e) => setIsBilled(e.target.value === "true")}
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </div>

            {editMode && (
              <div className="mb-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-1/3"
                  htmlFor="createdAt"
                >
                  Date de création
                </label>
                <input
                  type="date"
                  id="createdAt"
                  value={createdAt.split("T")[0]}
                  disabled
                  className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400 text-gray-500"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="post"
              >
                Poste
              </label>
              <select
                id="post"
                value={post}
                onChange={(e) => setPost(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
              >
                <option value="">Choisir un poste...</option>
                {posts.map((postItem) => (
                  <option key={postItem.id} value={postItem.abbreviation}>
                    {postItem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="hours"
              >
                Heures
              </label>
              <input
                type="text"
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
                min="0"
              />
            </div>

            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="nightHours"
              >
                Heures de nuit
              </label>
              <input
                type="text"
                id="nightHours"
                value={nightHours}
                onChange={(e) => setNightHours(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
                min="0"
              />
            </div>

            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="sundayHours"
              >
                Heures de dimanche
              </label>
              <input
                type="text"
                id="sundayHours"
                value={sundayHours}
                onChange={(e) => setSundayHours(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
                min="0"
              />
            </div>

            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="holidayHours"
              >
                Heures fériés
              </label>
              <input
                type="text"
                id="holidayHours"
                value={holidayHours}
                onChange={(e) => setHolidayHours(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
                min="0"
              />
            </div>

            {/* New input for lunch allowance */}
            <div className="mb-2 flex items-center">
              <label
                className="block text-sm font-medium text-gray-700 w-1/3"
                htmlFor="lunchAllowance"
              >
                Indemnité de déjeuner
              </label>
              <input
                type="number" // Changed to number for better UX
                id="lunchAllowance"
                value={lunchAllowance}
                onChange={(e) => setLunchAllowance(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-1 w-2/3 focus:outline-none focus:ring focus:ring-blue-400"
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400"
            >
              {isSubmitting
                ? "Envoi en cours..."
                : editMode
                ? "Mettre à jour"
                : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHoursModal;
