import { useState } from "react";

function ImageUpload({ onUploadSuccess }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Fehler beim Hochladen!");
      }

      setImageUrl(data.imageUrl);
      if (onUploadSuccess) onUploadSuccess(data.imageUrl); // ✅ URL an die Elternkomponente senden
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
      {uploading && <p>📤 Hochladen...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {imageUrl && (
        <div className="mt-2">
          <p className="text-green-600">✅ Bild erfolgreich hochgeladen!</p>
          <img src={imageUrl} alt="Hochgeladenes Bild" className="w-32 h-32 object-cover mt-2" />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;