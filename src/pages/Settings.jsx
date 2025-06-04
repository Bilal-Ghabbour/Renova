import { useState, useEffect } from "react";
import LocationSearch from "../components/LocationSearch";
import Footer from "../components/Footer";

function Settings() {
  const [location, setLocation] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      console.log("Token:", localStorage.getItem("token"));

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        
        if (!response.ok) throw new Error("Benutzerdaten konnten nicht geladen werden.");

        const data = await response.json();
        setLocation(data.location || "");
      } catch (error) {
        setMessage(`❌ Fehler: ${error.message}`);
      }
    }

    fetchUserData();
  }, []);

  const handleUpdateLocation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("❌ Bitte einloggen!");

    try {
      const response = await fetch("http://localhost:5000/api/users/update-location", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("✅ Standort erfolgreich aktualisiert!");
    } catch (error) {
      setMessage(`❌ Fehler: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("❌ Bitte einloggen!");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMessage("❌ Bitte fülle alle Passwortfelder aus.");
    }

    if (newPassword !== confirmPassword) {
      return setMessage("❌ Die Passwörter stimmen nicht überein.");
    }
      console.log("passowrd",newPassword);
      
    try {
      const response = await fetch("http://localhost:5000/api/users/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      console.log("respons");
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("✅ Passwort erfolgreich geändert!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(`❌ Fehler: ${error.message}`);
    }
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-50">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
          <h2 className="text-xl font-bold text-center">Einstellungen</h2>
          
          {/* Standort ändern */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-center">Standort:</label>
            <div className="flex flex-col items-center">
              <LocationSearch 
                onLocationSelect={handleLocationSelect} 
                initialValue={location}
                className="w-full"
              />
              <button
                onClick={handleUpdateLocation}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Standort aktualisieren
              </button>
            </div>
          </div>

          {/* Passwort ändern */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-center">🔒 Passwort ändern:</label>
            <div className="flex flex-col items-center space-y-2">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Aktuelles Passwort"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Neues Passwort"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Neues Passwort wiederholen"
              />
              <button
                onClick={handleChangePassword}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Passwort ändern
              </button>
            </div>
          </div>

          {/* Nachricht anzeigen */}
          {message && (
            <p className={`text-center ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Settings;