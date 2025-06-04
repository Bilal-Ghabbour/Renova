import { useState, useEffect, useRef } from "react";
import { FiChevronRight } from "react-icons/fi";     
import { FaCar, FaTools, FaLaptop, FaHome, FaTshirt, FaLeaf, FaPaw, FaGamepad, FaBriefcase, FaMusic } from "react-icons/fa";

const categories = [
  { name: "Auto, Rad & Boot", icon: <FaCar />, subcategories: ["Autos", "Autoteile & Reifen", "Boote & Bootszubehör", "Fahrräder & Zubehör", "Motorräder & Motorroller", "Motorradteile & Zubehör", "Nutzfahrzeuge & Anhänger", "Reparaturen & Dienstleistungen", "Wohnwagen & -mobile", "Weiteres Auto, Rad & Boot"] },
/*   { name: "Dienstleistungen", icon: <FaTools />, subcategories: ["Altenpflege", "Babysitter/-in & Kinderbetreuung", "Elektronik", "Haus & Garten", "Künstler/-in & Musiker/-in", "Reise & Event", "Tierbetreuung & Training", "Umzug & Transport", "Weitere Dienstleistungen"] },
 */  { name: "Elektronik", icon: <FaLaptop />, subcategories: ["Handys", "Laptops", "TV & Video", "Haushaltsgeräte", "Kameras", "Weitere Elektronik"] },
  { name: "Immobilien", icon: <FaHome />, subcategories: ["Wohnungen", "Häuser", "Gewerbeimmobilien", "Weitere Immobilien"] },
  { name: "Mode & Beauty", icon: <FaTshirt />, subcategories: ["Damenmode", "Herrenmode", "Schuhe", "Schmuck", "Kosmetik", "Weitere Mode & Beauty"] },
  { name: "Haus & Garten", icon: <FaLeaf />, subcategories: ["Möbel", "Dekoration", "Werkzeuge", "Gartenbedarf", "Küchengeräte", "Weitere Haus & Garten"] },
  { name: "Haustiere", icon: <FaPaw />, subcategories: ["Hunde", "Katzen", "Vögel", "Fische", "Kleintiere", "Weitere Haustiere"] },
/*   { name: "Freizeit & Hobby", icon: <FaGamepad />, subcategories: ["Sport", "Camping", "Musikinstrumente", "Bücher", "Kunst & Sammlerstücke", "Weitere Freizeit & Hobby"] },
 */  { name: "Jobs", icon: <FaBriefcase />, subcategories: ["Vollzeit", "Teilzeit", "Freelancer", "Praktika", "Aushilfsjobs", "Weitere Jobs"] },
/*   { name: "Musik, Filme & Bücher", icon: <FaMusic />, subcategories: ["CDs", "Vinyl", "DVDs", "Blu-rays", "Bücher", "Weitere Musik, Filme & Bücher"] }
 */];

export default function CategoryDropdown({ onSelectCategory }) {
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Alle Kategorien");
  const [viewAllCategories, setViewAllCategories] = useState(true);
  const dropdownRef = useRef(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setOpen(true); // إبقاء القائمة مفتوحة عند اختيار قسم رئيسي
    setViewAllCategories(false);
    setHoveredCategory(category); // تعيين القسم المحدد كـ hovered
    onSelectCategory(category); // ✅ استدعاء الدالة عند اختيار قسم رئيسي
  };

  const handleSubcategoryClick = (subcategory, event) => {
    event.stopPropagation(); // منع انتشار الحدث إلى القسم الرئيسي
    console.log("Subcategory clicked:", subcategory); // إضافة console.log للتصحيح
    setSelectedCategory(subcategory);
    setOpen(false); // إغلاق القائمة عند اختيار قسم فرعي
    onSelectCategory(subcategory);
  };

  const handleBackToAllCategories = () => {
    setViewAllCategories(true);
    setSelectedCategory("Alle Kategorien");
    setHoveredCategory(null); // إعادة تعيين hoveredCategory
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* زر فتح القائمة */}
      <button
        className="bg-white border-black rounded-xl px-4 py-2 w-60 text-left flex items-center"
        onClick={() => setOpen(!open)}
      >
        {selectedCategory}
      </button>

      {/* القائمة الرئيسية */}
      {open && (
        <div className="absolute bg-white border mt-1 w-64 shadow-md z-50">
          {/* زر العودة إلى "Alle Kategorien" */}
          {!viewAllCategories && (
            <div
              className="flex justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={handleBackToAllCategories}
            >
              <span className="ml-2">Alle Kategorien</span>
            </div>
          )}

          {/* عرض جميع الأقسام أو الأقسام المحددة */}
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer relative"
              onMouseEnter={() => setHoveredCategory(category)} // تعيين القسم عند التمرير
              onMouseLeave={() => setHoveredCategory(null)} // إعادة تعيين القسم عند مغادرة التمرير
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="flex items-center">
                {category.icon} <span className="ml-2">{category.name}</span>
              </span>
              <FiChevronRight />

              {/* عرض القائمة الفرعية عند التمرير */}
              {hoveredCategory === category && (
                <div
                  className="absolute left-full top-0 bg-white border shadow-lg w-48 z-50"
                  onMouseEnter={() => setHoveredCategory(category)} // منع إخفاء القائمة الفرعية عند التمرير فوقها
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                      onClick={(event) => handleSubcategoryClick(sub, event)} // تمرير الحدث هنا
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}