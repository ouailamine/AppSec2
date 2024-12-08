import React, { useState, useEffect } from 'react';

const AgentAvailableModal = ({ isOpen, onClose, siteUsers, eventsForSearchGuard, currentMonth, currentYear, onAddUserz, localSiteUsers }) => {

  console.log(eventsForSearchGuard);
  const [selectedDay, setSelectedDay] = useState(null);  // L'état pour stocker le jour sélectionné
  const [missingEvents, setMissingEvents] = useState([]);  // L'état pour stocker les utilisateurs sans événement

  // Fonction pour obtenir tous les jours du mois
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 0); // Le mois est basé sur un indice de 0 (0 = Janvier, 11 = Décembre)
    const daysInMonth = date.getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);  // Crée un tableau de 1 à n (jours du mois)
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // Fonction pour formater la date sélectionnée au format 'YYYY-MM-DD'
  const formatDate = (day) => {
    const month = String(currentMonth).padStart(2, '0');  // Format le mois en 2 chiffres
    const formattedDay = String(day).padStart(2, '0');  // Format le jour en 2 chiffres
    return `${currentYear}-${month}-${formattedDay}`;  // Retourne la date complète au format 'YYYY-MM-DD'
  };

  // Fonction appelée lors de la sélection d'un jour
  const handleDayChange = (event) => {
    const day = event.target.value;
    const formattedDate = formatDate(day);  // Formate le jour sélectionné
    setSelectedDay(formattedDate);  // Met à jour l'état selectedDay
  };

  // Fonction pour vérifier les utilisateurs sans événement pour le jour sélectionné
  const checkMissingEvents = () => {
    if (!selectedDay) return;  // Si aucun jour n'est sélectionné, on ne fait rien

    const ids = siteUsers.map(user => user.id);  // On extrait tous les user_id des utilisateurs
    const missing = ids.filter(userId => {
      // On filtre les user_id qui n'ont pas d'événement pour le jour sélectionné
      return !eventsForSearchGuard.some(event => {
        // Vérifier que la date de l'événement est bien au même format et correspond à selectedDay
        const eventDate = event.selected_days && event.selected_days.slice(0, 10); // Prendre la partie date de 'YYYY-MM-DD'
        return event.user_id === userId && eventDate === selectedDay;
      });
    });

    setMissingEvents(missing);  // On met à jour l'état avec les utilisateurs manquants
  };

  useEffect(() => {
    checkMissingEvents();  // On vérifie les événements manquants chaque fois que selectedDay change
  }, [selectedDay, eventsForSearchGuard, siteUsers]);

  console.log('Événements manquants pour le jour sélectionné:', missingEvents);

  if (!isOpen) return null;  // Si le modal n'est pas ouvert, on ne l'affiche pas

  // Fonction pour ajouter l'utilisateur sélectionné
  const handleAddUser = (user) => {
    console.log(user)
    onAddUserz(user);  // Appelle la fonction onAddUser avec l'utilisateur sélectionné
    onClose()
  };

  // Filtrer les utilisateurs manquants en ne montrant que ceux qui ne sont pas dans localSiteUsers
  const filteredMissingEvents = missingEvents.filter(userId => {
    return !localSiteUsers.some(localUser => localUser.id === userId);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg w-80">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">Agent Disponible</h2>
        
        {/* Menu de sélection du jour */}
        <div className="mb-4">
          <label htmlFor="daySelect" className="block text-sm font-medium text-gray-700">Choisir un jour</label>
          <select 
            id="daySelect" 
            value={selectedDay ? selectedDay.slice(8) : ''}  // Affiche seulement le jour sélectionné dans le menu
            onChange={handleDayChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>Choisir un jour</option>
            {daysInMonth.map(day => (
              <option key={day} value={day.toString().padStart(2, '0')}>{day.toString().padStart(2, '0')}/{currentMonth}/{currentYear}</option>  // Remplir le menu avec les jours du mois en 2 chiffres
            ))}
          </select>
        </div>

        {/* Affichage du jour sélectionné pour vérification */}
        {selectedDay && (
          <div className="mt-4">
            <p>Jour sélectionné : {selectedDay}</p> {/* Affichage de selectedDay */}
          </div>
        )}

        {/* Affichage des utilisateurs sans événement, mais excluant ceux déjà dans localSiteUsers */}
        {filteredMissingEvents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Agents sans événement ce jour-là:</h3>
            <ul>
              {filteredMissingEvents.map(userId => {
                // Trouver l'utilisateur correspondant à l'userId
                const user = siteUsers.find(user => user.id === userId);
                return user ? (
                  <li key={userId} className="flex items-center justify-between">
                    <span>{user.fullname} ({user.firstname}) - Agent ID: {user.id}</span>
                    <button
                      onClick={() => handleAddUser(user)}  // Appeler la fonction pour ajouter l'utilisateur
                      className="ml-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded"
                    >
                      Ajouter
                    </button>
                  </li>
                ) : (
                  <li key={userId}>Agent ID: {userId} non trouvé</li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentAvailableModal;
