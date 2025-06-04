import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const product = await response.json();
        
        setFormData({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          location: product.location,
          image: product.image,
        });
        setImagePreview(product.image);
      } catch (err) {
        console.error("Fehler beim Laden des Produkts:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fetchLocationSuggestions = async (query) => {
    try {
      const response = await fetch(
`https://nominatim.openstreetmap.org/search?q=${searchTerm}, Germany&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      return data.map((place) => place.display_name);
    } catch (error) {
      console.error("Fehler bei der Standortsuche:", error);
      return [];
    }
  };

  const handleLocationChange = async (e) => {
    const searchTerm = e.target.value;
    setFormData({ ...formData, location: searchTerm });

    if (searchTerm.length > 2) {
      const suggestions = await fetchLocationSuggestions(searchTerm);
      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.includes("Leopoldshöhe") || suggestion.includes("33818")
      );
      setLocationSuggestions(filteredSuggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "❌ Fehler beim Aktualisieren des Produkts!");
      }

      const data = await response.json();
      alert(data.message);
      navigate("/meins");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anzeige bearbeiten</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Titel */}
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Titel"
          className="block w-full border p-2"
          onChange={handleChange}
        />

        {/* Beschreibung */}
        <textarea
          name="description"
          value={formData.description}
          placeholder="Beschreibung"
          className="block w-full border p-2"
          onChange={handleChange}
        />

        {/* Preis */}
        <input
          type="number"
          name="price"
          value={formData.price}
          placeholder="Preis"
          className="block w-full border p-2"
          onChange={handleChange}
        />

        {/* Kategorie */}
        <select
          name="category"
          value={formData.category}
          className="block w-full border p-2"
          onChange={handleChange}
        >
          <option value="">Kategorie auswählen</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Autos">Autos</option>
          <option value="Möbel">Möbel</option>
          <option value="Kleidung">Kleidung</option>
          <option value="Immobilien">Immobilien</option>
        </select>

        {/* Standort */}
        <input
          type="text"
          name="location"
          value={formData.location}
          placeholder="Standort"
          className="block w-full border p-2"
          onChange={handleLocationChange}
        />
        {locationSuggestions.length > 0 && (
          <ul className="border p-2">
            {locationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setFormData({ ...formData, location: suggestion });
                  setLocationSuggestions([]);
                }}
                className="cursor-pointer hover:bg-gray-200"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}

        {/* Bild */}
        {imagePreview && (
          <img src={imagePreview} alt="Bildvorschau" className="mb-2 w-32 h-32 object-cover" />
        )}
        <input
          type="file"
          name="image"
          className="block w-full border p-2"
          onChange={handleChange}
        />

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Speichern
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
