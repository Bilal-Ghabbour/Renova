const API_URL = "http://localhost:5000/api/products"; // Dein Backend

// ✅ Alle Produkte abrufen
export async function getProducts(query = "", category = "", minPrice = "", maxPrice = "", sort = "newest") {
  let url = `${API_URL}?q=${encodeURIComponent(query)}&sort=${sort}`;

  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (minPrice) url += `&minPrice=${encodeURIComponent(minPrice)}`;
  if (maxPrice) url += `&maxPrice=${encodeURIComponent(maxPrice)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Fehler beim Abrufen der Produkte!");
    return data;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Produkte:", error);
    return [];
  }
}

// ✅ Neue Anzeige erstellen (Listing)
export async function createListing(formData) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/listings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // FormData enthält Datei-Uploads
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Erstellen der Anzeige!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Erstellen der Anzeige:", error);
    throw error;
  }
}

// ✅ Eigene Anzeigen abrufen
export async function getMyListings() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/user-listings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Abrufen der Anzeigen!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Anzeigen:", error);
    return [];
  }
}

// ✅ Eine Anzeige löschen
export async function deleteListing(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Löschen der Anzeige!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Löschen der Anzeige:", error);
    throw error;
  }
}

// ✅ Eine Anzeige aktualisieren
export async function updateListing(id, formData) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Aktualisieren der Anzeige!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Aktualisieren der Anzeige:", error);
    throw error;
  }
}

// ✅ **Favoriten abrufen**
export async function getFavorites() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Kein Token gefunden, Nutzer ist nicht eingeloggt!");
    return [];
  }

  try {
    const response = await fetch(`${API_URL}/favorites`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Abrufen der Favoriten!");

    return data; // Favoriten als Produkt-Array zurückgeben
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Favoriten:", error);
    return [];
  }
}

// ✅ **Produkt zu Favoriten hinzufügen**
export async function addFavorite(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Hinzufügen zu Favoriten!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Hinzufügen zu Favoriten:", error);
    throw error;
  }
}

// ✅ **Produkt aus Favoriten entfernen**
export async function removeFavorite(productId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("❌ Du bist nicht eingeloggt!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/favorites/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Fehler beim Entfernen aus Favoriten!");

    return data;
  } catch (error) {
    console.error("❌ Fehler beim Entfernen aus Favoriten:", error);
    throw error;
  }
}