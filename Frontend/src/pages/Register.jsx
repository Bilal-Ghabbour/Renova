import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  const [suggestions, setSuggestions] = useState([]); // 🔍 OpenStreetMap Vorschläge
  const [message, setMessage] = useState(""); // Nachricht für Bestätigung

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "location" && value.length > 2) {
      fetchLocationSuggestions(value);
    }
  };

  // 📍 OpenStreetMap API für Stadt oder PLZ-Suche
  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Fehler beim Laden der Standortvorschläge:", error);
    }
  };

  const handleSelectLocation = (suggestion) => {
    const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || suggestion.address.county;
    const postcode = suggestion.address.postcode || "";

    setFormData({
      ...formData,
      location: city ? `${city}, ${postcode}` : suggestion.display_name,
    });

    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("⚠️ Die Passwörter stimmen nicht überein!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Fehler: ${data.message}`);
        return;
      }

       // Nur Bestätigungsnachricht anzeigen, keine echte Verifizierung erforderlich
       setMessage("Vielen Dank für die Registrierung! Bitte bestätigen Sie Ihre E-Mail, bevor Sie sich einloggen können.");


      /* localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert(`✅ Willkommen, ${data.user.name}! Du bist jetzt eingeloggt.`);
      window.location.href = "/"; */
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      alert("❌ Fehler beim Registrieren. Sieh in die Konsole für Details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Registrieren</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input type="text" className="w-full p-2 border rounded" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input type="email" className="w-full p-2 border rounded" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Passwort:</label>
            <input type="password" className="w-full p-2 border rounded" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Passwort bestätigen:</label>
            <input type="password" className="w-full p-2 border rounded" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {/* 📍 Stadt oder PLZ suchen */}
          <div className="mb-4 relative">
            <label className="block text-gray-700">Stadt oder PLZ:</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="z. B. Berlin oder 10115"
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border rounded mt-1 w-full max-h-40 overflow-auto z-10">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelectLocation(suggestion)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="w-full rounded-2xl bg-blue-500 text-white p-2 rounded hover:bg-green-600">
            Registrieren
          </button>
         <div className="mt-4">
         <Link
              to="/login"
              className="px-6 py-2 rounded-2xl bg-green-600 text-white hover:bg-blue-500 transition block w-full sm:w-auto text-center"
            >
              Login
            </Link>
         </div>
        </form>

        {/* Bestätigungsnachricht */}
        {message && <div className="mt-4 text-green-600 font-semibold">{message}</div>}
      </div>
    </div>
  );
}

export default Register;