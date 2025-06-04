import { useState } from "react";

function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (input) => {
    setQuery(input);
    if (input.length > 1) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${input}&countrycodes=DE&addressdetails=1`
        );
        const data = await response.json();

        // ✅ Nur PLZ und Stadt extrahieren
        const filteredResults = data.map((place) => {
          const plz = place.address.postcode || ""; // PLZ aus Address-Feld holen
          const city = place.address.city || place.address.town || place.address.village || ""; // Stadt aus Address-Feld holen

          return { id: place.place_id, plz, city };
        });

        // Falls keine Stadt gefunden wurde, zeige nichts an
        setSuggestions(filteredResults.filter((p) => p.city !== ""));
      } catch (error) {
        console.error("Fehler bei der PLZ-Suche:", error);
      }
    }
  };

  const handleSelect = (selected) => {
    setQuery(`${selected.plz} ${selected.city}`); // ✅ Nur PLZ + Stadt setzen
    onLocationSelect(`${selected.plz} ${selected.city}`);
    setSuggestions([]); // Dropdown schließen
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="PLZ oder Ort"
       className="border border-black p-2 w-full rounded-xl bg-white"
      />
      {suggestions.length > 0 && (
        <div className="absolute left-0 mt-1 bg-white border shadow-lg w-full z-50">
          {suggestions.map((place) => (
            <div
              key={place.id}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(place)}
            >
              {place.plz} {place.city} {/* ✅ Nur PLZ + Stadt anzeigen */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;