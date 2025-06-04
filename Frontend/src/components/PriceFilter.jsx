import { useState } from "react";

function PriceFilter({ onFilter }) {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleFilter = () => {
    onFilter(minPrice, maxPrice);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-4">
      <h3 className="font-semibold mb-2">Preis</h3>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min Preis"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Preis"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
      </div>
      <button
        onClick={handleFilter}
        className="w-full bg-blue-500 text-white p-2 mt-2 rounded-md hover:bg-blue-600"
      >
        Anwenden
      </button>
    </div>
  );
}

export default PriceFilter;