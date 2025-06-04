import { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import ProductItem from "./ProductItem";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [locationFilter, setLocationFilter] = useState(""); // 📍 Standort-Filter
  const [categoryFilter, setCategoryFilter] = useState(""); // Kategorie-Filter
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchData() {
      const data = await getProducts("", "", "", "", sortOrder, locationFilter);
      setProducts(data);

      // Filter Products based on Category and Location
      const filteredData = data.filter(product => {
        return (categoryFilter ? product.category === categoryFilter : true) &&
               (locationFilter ? product.location === locationFilter : true);
      });
      setFilteredProducts(filteredData);
    }
    fetchData();
  }, [sortOrder, locationFilter, categoryFilter]); // Beobachtet auch `categoryFilter` 

  const handleCategorySelect = (category) => {
    setCategoryFilter(category); // Kategorie setzen
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* Standort-Dropdown hinzufügen */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Alle Orte</option>
          <option value="Berlin">Berlin</option>
          <option value="Hamburg">Hamburg</option>
          <option value="München">München</option>
        </select>

        {/* Kategorie-Dropdown hinzufügen */}
        <select
          value={categoryFilter}
          onChange={(e) => handleCategorySelect(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Alle Kategorien</option>
          <option value="Auto, Rad & Boot">Auto, Rad & Boot</option>
          <option value="Elektronik">Elektronik</option>
          <option value="Möbel">Möbel</option>
          {/* Weitere Kategorien hinzufügen */}
        </select>

        {/* Sortierung-Dropdown */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="newest">Neueste</option>
          <option value="price-asc">Preis aufsteigend</option>
          <option value="price-desc">Preis absteigend</option>
          <option value="random">Zufällig</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              isOwner={user && product.userId === user._id}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">Keine Produkte gefunden.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
