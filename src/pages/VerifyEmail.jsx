
import { useEffect, useState } from "react";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifiziere E-Mail...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      setMessage("❌ Kein Verifizierungstoken gefunden.");
      return;
    }

    fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("❌ Fehler bei der Verifizierung."));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">E-Mail Verifizierung</h2>
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;

