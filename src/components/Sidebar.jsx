import { useState } from "react";

function Sidebar() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-3">Kategorien</h2>
      <ul>
        <li className="hover:underline cursor-pointer">Auto</li>
        <li className="hover:underline cursor-pointer">Elektronik</li>
        <li className="hover:underline cursor-pointer">Möbel</li>
        {/* Weitere Kategorien */}
      </ul>

      <h2 className="text-lg font-bold mt-4">Preis</h2>
      <input
        type="number"
        placeholder="Min Preis"
        className="border p-2 w-full mb-2"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Max Preis"
        className="border p-2 w-full"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>
  );
}

export default Sidebar;