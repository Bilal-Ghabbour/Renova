const categories = [
  "Auto, Rad & Boot",
  "Elektronik",
  "Immobilien",
  "Möbel",
  "Haustiere",
  "Mode & Beauty",
  "Jobs",
];

function CategoryList({ onCategorySelect }) {
  return (
    <div className="category-list">
      <h3>Kategorien</h3>
      <ul>
        {categories.map((category) => (
          <li key={category} onClick={() => onCategorySelect(category)}>
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
