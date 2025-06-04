/* import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );
        if (!response.ok) throw new Error("Produkt nicht gefunden");

        const data = await response.json();
        setProduct(data);

        console.log("🔍 Produkt-Daten:", data); // <-- Hier prüfen, ob das Bild vorhanden ist

        // Prüfe, ob das Produkt in den Favoriten ist
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error("Fehler beim Laden des Produkts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Bitte eine Nachricht eingeben.");
      return;
    }

    const payload = { message, phone: phone.trim() || "Nicht angegeben" };

    try {
      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Nachricht erfolgreich gesendet!");
        setMessage("");
        setPhone("");
      } else {
        alert("Fehler beim Senden der Nachricht.");
      }
    } catch (error) {
      console.error("Fehler beim Senden:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ Bitte einloggen!");
  
      const response = await fetch(`http://localhost:5000/api/products/${id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
  
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
  
      // Favoritenstatus umschalten, wenn die Anfrage erfolgreich ist
      setIsFavorite(!isFavorite);
      alert(data.message);
    } catch (error) {
      alert(`❌ Fehler: ${error.message}`);
    }
  };
  
  

  if (loading) return <p>Lädt...</p>;
  if (!product) return <p>Produkt nicht gefunden.</p>;

  // Debugging: Bild-URL ausgeben
  console.log("Bild-URL:", product.image); */

/*   return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>
 */
      {/* Herz-Icon für Favoriten */}
  /*     <button onClick={handleToggleFavorite} className="text-red-500 text-2xl">
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <div className="flex gap-2">
        {product.image ? (
          <img
            src={
              Array.isArray(product.image)
                ? product.image[0]
                : product.image || "/fallback-image.jpg"
            }
            alt={product.title}
            className="w-64 h-64 object-cover"
          />
        ) : (
          <img
            src="/fallback-image.jpg"
            alt="Kein Bild verfügbar"
            className="w-64 h-64 object-cover"
          />
        )}
      </div> */

      {/* Verkäufername */}
 /*      <p className="text-gray-600 mt-4">
        <strong>Verkäufer:</strong> {product.userId?.name || "Unbekannt"}
      </p>

      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-lg font-bold mt-2">{product.price} €</p>
      {/* 🔥 Standort anzeigen */
    /*   <p className="text-gray-600 mt-2">
        📍 <strong>Standort:</strong> {product.location || "Unbekannter Ort"}
      </p> */ 
      {/* Nachricht senden */}
   /*    <div className="mt-6 p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Nachricht senden</h2>
        <textarea
          className="border p-2 w-full"
          placeholder="Schreibe eine Nachricht..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          className="border p-2 w-full mt-2"
          placeholder="Telefonnummer (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleSendMessage}
        >
          Nachricht senden
        </button> */

        {/* Datenschutzhinweise */}
      /*   <p className="text-black-500 text-sm mt-2">
          Deine Daten werden dem Anbieter übermittelt und bei zukünftigen
          Anfragen automatisch vorausgefüllt.
          <a href="#" className="underline">
            {" "}
            Weitere Infos
          </a>
        </p>
        <p className="text-black-500 text-sm">
          Wir überprüfen Nachrichten auf Verstöße gegen unsere{" "}
          <a href="#" className="underline">
            Nutzungsbedingungen
          </a>
          . Weitere Infos findest du in unserer{" "}
          <a href="#" className="underline">
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ProductDetails; */


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error("Produkt nicht gefunden");

        const data = await response.json();
        setProduct(data);

        console.log("🔍 Produkt-Daten:", data); // <-- Hier prüfen, ob das Bild vorhanden ist

        // Prüfe, ob das Produkt in den Favoriten ist
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setIsFavorite(favorites.includes(id));
      } catch (error) {
        console.error("Fehler beim Laden des Produkts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert("Bitte eine Nachricht eingeben.");
      return;
    }

    const payload = { 
      content: message, 
      receiver: product.userId?._id,  // Empfänger-ID holen
      productId: product._id,  // Produkt-ID holen
      phone: phone.trim() || "Nicht angegeben" 
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ Kein Token, Zugriff verweigert!");
        return;
      }

      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Nachricht erfolgreich gesendet!");
        setMessage("");
        setPhone("");
      } else {
        alert(`Fehler beim Senden der Nachricht: ${data.message}`);
      }
    } catch (error) {
      console.error("Fehler beim Senden:", error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("❌ Bitte einloggen!");
  
      const response = await fetch(`http://localhost:5000/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.message);
  
      setIsFavorite(!isFavorite);
      alert(data.message);
    } catch (error) {
      alert(`❌ Fehler: ${error.message}`);
    }
  };

  if (loading) return <p>Lädt...</p>;
  if (!product) return <p>Produkt nicht gefunden.</p>;

  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{product.title}</h1>

      {/* Herz-Icon für Favoriten */}
      <button onClick={handleToggleFavorite} className="text-red-500 text-2xl mb-5">
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <div className="flex gap-2">
  {product.image ? (
    <a 
      href={Array.isArray(product.image) ? product.image[0] : product.image || "/fallback-image.jpg"} 
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={Array.isArray(product.image) ? product.image[0] : product.image || "/fallback-image.jpg"}
        alt={product.title}
        className="w-64 h-64 object-contain cursor-pointer transition-transform duration-300 hover:scale-110"
      />
    </a>
  ) : (
    <img
      src="/fallback-image.jpg"
      alt="Kein Bild verfügbar"
      className="w-64 h-64 object-contain transition-transform duration-300 hover:scale-110"
    />
  )}
</div>

      {/* Verkäufername */}
      <p className="text-gray-600 mt-4">
        <strong>Verkäufer:</strong> {product.userId?.name || "Unbekannt"}
      </p>

      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-lg font-bold mt-2">{product.price} €</p>
      {/* 🔥 Standort anzeigen */}
      <p className="text-gray-600 mt-2">
        📍 <strong>Standort:</strong> {product.location || "Unbekannter Ort"}
      </p>

      {/* Nachricht senden */}
      <div className="mt-6 p-4 border rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Nachricht senden</h2>
        <textarea
          className="border p-2 w-full"
          placeholder="Schreibe eine Nachricht..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          className="border p-2 w-full mt-2"
          placeholder="Telefonnummer (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleSendMessage}
        >
          Nachricht senden
        </button>

        {/* Datenschutzhinweise */}
        <p className="text-black-500 text-sm mt-2">
          Deine Daten werden dem Anbieter übermittelt und bei zukünftigen
          Anfragen automatisch vorausgefüllt.
          <a href="#" className="underline">
            {" "}
            Weitere Infos
          </a>
        </p>
        <p className="text-black-500 text-sm">
          Wir überprüfen Nachrichten auf Verstöße gegen unsere{" "}
          <a href="#" className="underline">
            Nutzungsbedingungen
          </a>
          . Weitere Infos findest du in unserer{" "}
          <a href="#" className="underline">
            Datenschutzerklärung
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default ProductDetails;
