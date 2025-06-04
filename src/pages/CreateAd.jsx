import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "../components/CategoryDropdown";
import Footer from "../components/Footer";

function CreateAd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = async (e) => {
    if (!formData.category || formData.category.trim() === "") {
      alert("❌ Bitte wähle eine Kategorie aus!");
      setLoading(false);
      return;
    }
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ Du bist nicht eingeloggt. Bitte melde dich an.");
      navigate("/login");
      return;
    }

    if (!formData.image) {
      alert("❌ Bitte lade ein Bild hoch!");
      setLoading(false);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("price", formData.price);
    uploadData.append("category", formData.category);
    uploadData.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Anzeige erfolgreich erstellt!");
        navigate("/meins");
      } else {
        alert(`❌ Fehler: ${data.message || "Anzeige konnte nicht erstellt werden."}`);
      }
    } catch (error) {
      console.error("❌ Fehler:", error);
      alert("❌ Netzwerkfehler beim Erstellen der Anzeige.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen p-4 bg-green-50">
      <div className="p-6 max-w-lg w-full bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Anzeige erstellen</h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-green-600">✅ Bildvorschau:</p>
              <img src={imagePreview} alt="Vorschau" className="w-32 h-32 object-cover mt-2" />
            </div>
          )}

          <input
            type="text"
            name="title"
            placeholder="Titel"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Beschreibung"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Preis (€)"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <div className="relative">
            <CategoryDropdown onSelectCategory={handleCategorySelect} />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white`}
            disabled={loading}
          >
            {loading ? "⏳ Erstelle Anzeige..." : "Erstellen"}
          </button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default CreateAd;