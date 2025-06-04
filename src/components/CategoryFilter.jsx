import { useState } from "react";

function CategoryFilter({ categories, onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-semibold mb-2">Kategorien</h3>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Alle Kategorien</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;