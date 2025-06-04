import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";



function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Speichert die Login-Daten
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Überwacht Änderungen im Local Storage (für automatisches Logout)
    const storageListener = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  // 🔐 Login-Funktion
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
        setUser(data.user); // ✅ Direkt den User im State aktualisieren
        alert("✅ Login erfolgreich!");
        navigate("/"); // 🚀 Zur Startseite navigieren
      } else {
        throw new Error("❌ Fehlendes Token oder Nutzerdaten!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Logout-Funktion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // 🚀 Nach Logout direkt zur Startseite
  };

  // 🔐 Geschützte Route
  const handleProtectedRoute = (route) => {
    if (!user) {
      alert("❌ Bitte melde dich zuerst an!");
      navigate("/login");
    } else {
      navigate(route);
    }
  };

  // تبديل حالة القائمة
  const toggleMenu = (e) => {
    e.stopPropagation(); // منع انتشار الحدث
    setMenuOpen((prevState) => !prevState); // Umkehrung des aktuellen Menü-Zustands
  };

  return (
    <header className="pl-10 pr-10 bg-green-950  rounded-1xl p-4 text-white flex flex-wrap justify-between items-center shadow-lg space-y-4 sm:space-y-0 sm:flex-row sm:items-center w-full">
      {/* Logo & Name */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src="/assets/Logo.png"
          alt="Logo"
          className="w-20 h-20 rounded-3xl object-contain transition-transform duration-300 hover:scale-110"
        />
        <h1 className="text-6xl font-bold cursor-pointer">
          <Link to="/">
            <span className=" text-white  hover:text-green-500 transition">
              ReNova
            </span>
          </Link>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center gap-4 sm:gap-6 sm:flex-row sm:ml-auto w-full sm:w-auto justify-between">
        {user ? (
          <div className="relative w-full sm:w-auto" ref={menuRef}>
            <button
              className="px-6 py-2 bg-green-600 text-white text-[20px] rounded-3xl hover:bg-blue-600 transition-all duration-300 w-full sm:w-auto"
              onClick={toggleMenu}
            >
              <FaUser className="inline mr-2" />
              {`Hallo, ${user.name || "Gast"}`}
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-48 z-50 transition-all duration-300"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer transition-all duration-200">
                    <Link to="/meins">Meine Anzeigen</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer transition-all duration-200">
                    <Link to="/favorites">Favoriten</Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer transition-all duration-200"
                    onClick={() => handleProtectedRoute("/settings")}
                  >
                    <Link to="/settings">Einstellungen</Link>
                  </li>

                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer transition-all duration-200"
                    onClick={() => handleProtectedRoute("/nachrichten")} // Route für Nachrichten
                  >
                    Nachrichten
                  </li>

                  <li
                    className="px-4 py-2 text-red-500 cursor-pointer hover:bg-red-600 transition-all duration-200"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Ausloggen
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              to="/login"
              className="px-12 py-1 text-2xl  rounded-3xl bg-blue-600 text-white hover:bg-green-500 transition block w-full sm:w-auto text-center"
            >
              Login
            </Link>
          
            
          </div>
        )}

        {/* Anzeige erstellen Button */}
        <button
          className="px-6 py-2 bg-green-600 text-white text-[20px] rounded-3xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 block w-full sm:w-auto"
          onClick={() => handleProtectedRoute("/create-ad")}
        >
          Anzeige erstellen
        </button>
      </nav>
    </header>
  );
}

export default Header;
