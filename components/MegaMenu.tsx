import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { ChevronRight } from "lucide-react";

const MegaMenu = ({ isOpen, onClose, menuData }) => {
  const { t } = useTranslation("common");
  const [activeCategory, setActiveCategory] = useState("all-products");
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200"
      ref={menuRef}
    >
      <div className="container mx-auto py-6">
        <div className="flex">
          {/* Main Categories */}
          <div className="w-1/5 border-r border-gray-200 dark:border-gray-700 pr-4">
            <ul>
              {menuData.map((category) => (
                <li key={category.id} className="mb-2">
                  <button
                    className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400 font-medium"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Subcategories */}
          <div className="w-4/5 pl-6">
            {activeCategory && (
              <div className="flex">
                {/* Subcategories and Items */}
                <div className="w-3/4 grid grid-cols-3 gap-6">
                  {menuData
                    .find((category) => category.id === activeCategory)
                    ?.subcategories.map((subcategory, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                          {subcategory.name}
                        </h3>
                        <ul className="space-y-2">
                          {subcategory.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                href={item.url}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"
                              >
                                <span className="group-hover:translate-x-1 transition-transform">
                                  {item.name}
                                </span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 ml-1 transition-opacity" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>

                {/* Featured Section */}
                <div className="w-1/4 pl-6 border-l border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Featured
                  </h3>
                  <div className="space-y-4">
                    {menuData
                      .find((category) => category.id === activeCategory)
                      ?.featured.map((item, index) => (
                        <div key={index}>
                          {item.type === "button" ? (
                            <Link
                              href={item.url}
                              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            <Link
                              href={item.url}
                              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group"
                            >
                              <span className="group-hover:translate-x-1 transition-transform">
                                {item.name}
                              </span>
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            {!activeCategory && (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a category to view options</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className="bg-gray-100 dark:bg-gray-700 py-3 px-6 flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Free shipping on orders over $100
        </div>
        <button
          onClick={onClose}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Close Menu
        </button>
      </div> */}
    </div>
  );
};

export default MegaMenu;
