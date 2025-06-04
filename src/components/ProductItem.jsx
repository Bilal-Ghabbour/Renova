import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductItem({ product, isOwner, onDelete, onFavoriteChange }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Wenn es deine eigene Anzeige ist, setze `isFavorite` immer auf false
    if (isOwner) {
      setIsFavorite(false); // Deine eigene Anzeige bekommt kein Herz
      return;
    }

    const checkFavoriteStatus = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        const isFavorited = data.some(
          (favorite) => favorite._id === product._id
        );
        setIsFavorite(isFavorited);
      } catch (error) {
        console.error("Fehler beim Überprüfen der Favoriten:", error.message);
      }
    };

    checkFavoriteStatus();
  }, [token, product._id, isOwner]);

  const handleFavoriteToggle = async () => {
    if (!token) {
      alert("Bitte melde dich an, um Favoriten zu speichern.");
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`http://localhost:5000/api/favorites/${product._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsFavorite(false);
        if (onFavoriteChange) onFavoriteChange();
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        setIsFavorite(true);
        if (onFavoriteChange) onFavoriteChange();
      }
    } catch (error) {
      console.error("Fehler beim Verwalten der Favoriten:", error.message);
    }
  };

  return (
    <div className="border p-4 rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 ease-in-out bg-green-50">

      <Link to={`/product/${product._id}`} className="block">
      <img
  src={
    Array.isArray(product.image) && product.image.length > 0
      ? product.image[0]
      : product.image
  }
  alt={product.title}
  className="w-full h-40 object-contain mb-3 rounded-xl"
/>

        <h3 className="text-lg font-bold">{product.title}</h3>
        <p className="text-gray-600">{product.price} €</p>
        <p className="text-gray-500">
          📍 {product.location || "Unbekannter Ort"}
        </p>
        <p className="text-gray-500">{product.description}</p>
      </Link>

      <div className="flex justify-between mt-2">
        {isOwner ? (   // Wenn du der Besitzer bist, zeige nur Bearbeiten und Löschen
          <>
            <Link to={`/edit/${product._id}`} className="text-green-500">
              ✏️ Bearbeiten
            </Link>
            <button
              onClick={() => onDelete(product._id)}
              className="text-red-500"
            >
              🗑️ Löschen
            </button>
          </>
        ) : (
          !isOwner && token && (  // Zeige das Herz nur, wenn der Nutzer NICHT der Besitzer ist
            <button
              onClick={handleFavoriteToggle}
              className={`text-2xl ${
                isFavorite ? "text-red-500" : "text-gray-500"
              }`}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ProductItem;


/* import { Link } from "react-router-dom";
import { useState } from "react";

function ProductItem({ product, isOwner, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm("Willst du die Anzeige wirklich löschen?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "❌ Fehler beim Löschen!");
      }

      const data = await response.json(); // Erfolgsnachricht
      alert(data.message);

      if (onDelete) onDelete(product._id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={
            Array.isArray(product.image) && product.image.length > 0
              ? product.image[0]
              : product.image
          }
          alt={product.title}
          className="w-full h-40 object-cover mb-2"
        />
        <h3 className="text-lg font-bold">{product.title}</h3>
        <p className="text-gray-600">{product.price} €</p>
        <p className="text-gray-500">
          📍 {product.location || "Unbekannter Ort"}
        </p>
        <p className="text-gray-500">{product.description}</p>
      </Link>

      {isOwner && (
        <div className="flex justify-between mt-2">
          <Link to={`/edit/${product._id}`} className="text-green-500">
            ✏️ Bearbeiten
          </Link>
          <button
            onClick={() => onDelete(product._id)}
            className="text-red-500"
          >
            🗑️ Löschen
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductItem;
 */
/* import { Link } from "react-router-dom";
import { useState } from "react";

function ProductItem({ product, isOwner, onDelete }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    if (!window.confirm("Willst du die Anzeige wirklich löschen?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "❌ Fehler beim Löschen!");
      }

      const data = await response.json(); 
      alert(data.message);

      if (onDelete) onDelete(product._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddFavorite = async () => {
    if (!token) {
      alert("Bitte melde dich an, um Favoriten zu speichern.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsFavorite(true);
      alert(data.message);
    } catch (error) {
      alert("Fehler beim Hinzufügen zu den Favoriten: " + error.message);
    }
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={
            Array.isArray(product.image) && product.image.length > 0
              ? product.image[0]
              : product.image
          }
          alt={product.title}
          className="w-full h-40 object-cover mb-2"
        />
        <h3 className="text-lg font-bold">{product.title}</h3>
        <p className="text-gray-600">{product.price} €</p>
        <p className="text-gray-500">📍 {product.location || "Unbekannter Ort"}</p>
        <p className="text-gray-500">{product.description}</p>
      </Link>

      <div className="flex justify-between mt-2">
        {isOwner && (
          <>
            <Link to={`/edit/${product._id}`} className="text-green-500">
              ✏️ Bearbeiten
            </Link>
            <button onClick={handleDelete} className="text-red-500">
              🗑️ Löschen
            </button>
          </>
        )}
        {!isOwner && (
          <button
            onClick={handleAddFavorite}
            className={`text-red-500 ${isFavorite ? "text-gray-400" : ""}`}
          >
            {isFavorite ? "❤️ Gespeichert" : "🤍 Favorit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
 */
