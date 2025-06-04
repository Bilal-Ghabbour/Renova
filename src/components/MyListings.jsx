import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductItem from "../components/ProductItem";

function MyListings() {
  const [listings, setListings] = useState([]);
  const token = localStorage.getItem("token"); // Korrekte Token-Abruf

  useEffect(() => {
    if (!token) return;

    async function fetchListings() {
      try {
        const response = await fetch("http://localhost:5000/api/products/user-listings", {
          headers: { Authorization: `Bearer ${token}` }, // Korrekte Token-Übergabe
        });

        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Fehler beim Laden der Anzeigen:", error);
      }
    }

    fetchListings();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Meine Anzeigen</h2>

      {listings.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500 mb-4">Du hast keine Anzeigen erstellt.</p>
          <Link to="/create-ad" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            ➕ Anzeige erstellen
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ProductItem key={listing._id} product={listing} isOwner={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;