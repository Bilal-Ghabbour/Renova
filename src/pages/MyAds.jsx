import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductItem from "../components/ProductItem";
import Footer from "../components/Footer";

function MyAds() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      setError("❌ Bitte melde dich an, um deine Anzeigen zu sehen.");
      setLoading(false);
      return;
    }
  
    const fetchAds = async () => {
      try {
        setError(""); // Setzt die Fehlermeldung zurück, falls vorher Fehler war.
        const response = await fetch("http://localhost:5000/api/products/user-listings", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Fehler beim Laden der Anzeigen!");
        }
  
        const ads = await response.json();
        console.log("🛍️ Geladene Anzeigen:", ads); // Debugging-Log
        setListings(ads);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAds();
  }, [token]);
  


  const handleDelete = async (id) => {
    if (!window.confirm("Willst du die Anzeige wirklich löschen?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { 
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "❌ Fehler beim Löschen!");
      }

      const data = await response.json();
      alert(data.message);
      setListings((prevListings) => prevListings.filter((listing) => listing._id !== id));
    } catch (err) {
      alert(err.message);
    }
};

  


  return (
    <> 
    <div className="container mx-auto p-4 mt-10  block  min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Meine Anzeigen</h1>

      {loading && <p className="text-gray-500">⏳ Laden...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && listings.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Du hast keine Anzeigen erstellt.</p>
          <Link to="/create-ad" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            ➕ Anzeige erstellen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ProductItem 
            key={listing._id} 
            product={listing} 
            isOwner={true} 
            onDelete={handleDelete} 
          />
          ))}
        </div>
      )}
    </div>
<Footer/>
</>
  );
}

export default MyAds;