import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Navigation nach Login
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Navigation verwenden

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login fehlgeschlagen");
      }
  
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("✅ Login erfolgreich!");
        window.location.href = "/"; // Nach Login zur Startseite weiterleiten
      } else {
        throw new Error("❌ Fehlendes Token oder Nutzerdaten!");
      }
    } catch (err) {
      console.error("Fehler beim Login:", err);
      alert(err.message);
    }
  };
  
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">🔑 Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Deine E-Mail"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Passwort:</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Dein Passwort"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Einloggen
          </button>
          
        </form>
        <div className="mt-4">
        <Link
              to="/register"
              className="px-6 py-2 rounded-2xl bg-blue-600 text-white hover:bg-green-500 transition block w-full sm:w-auto text-center"
            >
              Registrieren
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;