import { useState, useEffect } from "react";
import ProductItem from "../components/ProductItem";
import Footer from "../components/Footer";

function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFavoriteProducts(data);
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten:", error.message);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  const handleRemoveFavorite = async (productId) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert(data.message);  
      fetchFavorites();  // 🔄 Favoritenliste neu laden nach dem Löschen
    } catch (error) {
      alert("Fehler beim Entfernen des Favoriten: " + error.message);
    }
  };

  return (
    <> 
    <div className="container mx-auto p-4 mt-10  block  min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold mb-4">Meine Favoriten</h1>
      
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {favoriteProducts.map(product => (
            <div key={product._id}>
              <ProductItem product={product} onFavoriteChange={fetchFavorites} />  {/* 📌 Änderung hier */}
              <button 
                onClick={() => handleRemoveFavorite(product._id)}
                className="text-red-500 mt-2"
              >
               
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Du hast noch keine Favoriten gespeichert.</p>
      )}
    </div>
    <Footer/>
    </>
  );
}

export default Favorites;
