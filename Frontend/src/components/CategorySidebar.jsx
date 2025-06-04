const categories = [
  {
    name: "Auto, Rad & Boot",
    subcategories: ["Autos", "Autoteile & Reifen", "Motorräder", "Boote"],
  },
  {
    name: "Immobilien",
    subcategories: ["Wohnungen", "Häuser", "Gewerbeimmobilien"],
  },
  {
    name: "Elektronik",
    subcategories: ["Handys", "Laptops", "TV & Video", "Haushaltsgeräte"],
  },
  {
    name: "Haustiere",
    subcategories: ["Hunde", "Katzen", "Fische", "Pferde"],
  },
];

const CategorySidebar = () => {
  return (
    <div className="bg-white p-4 rounded shadow-md w-64">
      <h2 className="font-bold text-lg mb-4">Kategorien</h2>
      {categories.map((category, index) => (
        <div key={index} className="mb-3">
          <h3 className="font-semibold">{category.name}</h3>
          <ul className="ml-4 text-sm text-gray-600">
            {category.subcategories.map((sub, subIndex) => (
              <li key={subIndex} className="hover:underline cursor-pointer">
                {sub}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategorySidebar;
