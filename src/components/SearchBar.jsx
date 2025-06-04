import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import LocationSearch from "./LocationSearch";
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch }) {
  const [category, setCategory] = useState("Alle Kategorien");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("Gesamte Stadt");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    try {
      let url = "http://localhost:5000/api/products/search"; 
      const queryParam = searchQuery.trim() ? `query=${searchQuery}` : "";
      const categoryParam = category !== "Alle Kategorien" ? `&category=${category}` : "";
      const locationParam = location ? `&location=${location}` : "";
      const distanceParam = distance !== "Gesamte Stadt" ? `&distance=${distance.split(' ')[0]}` : "";

      url = `${url}?${queryParam}${categoryParam}${locationParam}${distanceParam}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server-Fehler: ${response.status}`);

      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
    }
  };

  return (
    <div className="bg-green-950 p-3 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row md:flex-nowrap items-center p-1 space-y-2 md:space-y-0 md:space-x-4 w-full">
        {/* حقل البحث */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Was suchst du?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border border-gray-300 text-gray-800 text-sm bg-white pl-8 pr-2 rounded-lg w-full focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* الفئات */}
        <div className="">
          <CategoryDropdown 
            onSelectCategory={setCategory}
            className="w-full text-sm h-10"
          />
        </div>

        {/* الموقع */}
        <div className="">
          <LocationSearch
            onLocationSelect={setLocation}
            placeholder="PLZ oder Ort"
            className="w-full text-sm h-10"
          />
        </div>

        {/* المسافة */}
        <div className="flex-1">
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="h-10 text-gray-800 text-sm border border-gray-300 bg-white px-2 rounded-lg w-full focus:ring-2 focus:ring-green-400 transition"
          >
            <option>Gesamte Stadt</option>
            <option>10 km</option>
            <option>30 km</option>
            <option>50 km</option>
            <option>100 km</option>
            <option>200 km</option>
          </select>
        </div>

        {/* زر البحث */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleSearch}
            className="h-10 bg-green-600 hover:bg-blue-600 text-white text-lg font-medium px-10 rounded-lg transition w-full md:w-auto"
          >
            Finden
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
