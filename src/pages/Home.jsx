import { useState, useEffect } from "react";
import ProductItem from "../components/ProductItem";
import SearchBar from "../components/SearchBar"; // Falls der Pfad anders ist, anpassen
import ImageFix from "../components/imageFix";
import Footer from "../components/Footer";

function Home() {
  const [listings, setListings] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Benutzerdaten aus localStorage abrufen

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div className="bg-green-50">
        <ImageFix />
      </div>
      <div className="container mx-auto p-4 bg-green-50">
        <SearchBar onSearch={setListings} />

        <h1 className="text-2xl font-bold mt-12 mb-12 text-center">Anzeigen</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {listings.map((listing) => (
            <ProductItem
              key={listing._id}
              product={listing}
              isOwner={user && listing.userId === user._id} // ✔️ Korrektur hier!
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
