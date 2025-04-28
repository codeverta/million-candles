import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Login from "./molecules/Login";
import { Modal } from "@mui/material";
import Drawer from "./flowbite/Drawer";
import { useRouter } from "next/router";
import { ChevronDown, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useTranslation } from "next-i18next";

// Define available languages
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "kr", name: "한국어", flag: "🇰🇷" },
];

export default function Header(props) {
  const { t } = useTranslation("common");
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState({
    drawer: false,
    login: false,
    langDropdown: false,
  });

  const router = useRouter();
  const { locale } = router;

  const [currentLang, setCurrentLang] = useState(
    languages.find((lang) => lang.code === locale) || languages[0]
  );

  const [darkMode, setDarkMode] = useState(false);
  const langDropdownRef = useRef(null);

  const handleOpenLogin = () => {
    setOpen({ ...open, login: !open.login });
  };

  const handleDrawer = () => {
    setOpen({ ...open, drawer: !open.drawer });
  };

  const toggleLangDropdown = () => {
    setOpen({ ...open, langDropdown: !open.langDropdown });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    setOpen({ ...open, langDropdown: false });
    changeLanguage(lang.code);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setOpen((prev) => ({ ...prev, langDropdown: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check for authentication token
  useEffect(() => {
    // This hook is for initial locale setup and checking system dark mode preference
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/admin/orders");
    }

    // Check for system dark mode preference only on initial mount
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, [router]); // Add router as dependency

  useEffect(() => {
    const updatedMenus = [
      { label: t("menu.home", "Home"), url: "/" },
      { label: t("menu.products", "Products"), url: "/products" },
      { label: t("menu.how_to_order", "How to Order"), url: "/cara-order" },
      { label: t("menu.address", "Address"), url: "/address" },
      { label: t("menu.blog", "Blog"), url: "/posts" },
      { label: t("menu.gallery", "Gallery"), url: "/gallery" },
      { label: t("menu.about", "About"), url: "/about" },
    ];
    setMenus(updatedMenus);
  }, [locale]); // Use locale instead of t as dependency

  return (
    <header className="sticky top-0 z-50">
      {open.login && (
        <Modal
          open={open.login}
          onClose={handleOpenLogin}
          aria-labelledby="modal-login"
          aria-describedby="parent-modal-description"
          className="grid h-screen place-items-center"
        >
          <div>
            <Login />
          </div>
        </Modal>
      )}

      {open.drawer && (
        <Drawer
          menu={menus}
          handleDrawer={handleDrawer}
          currentPath={router.pathname}
        />
      )}

      <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200 print:hidden shadow-sm">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <img
              src="/logolilin.png"
              className="mr-3 rounded-full w-9 h-9 sm:w-12 sm:h-12 transition-transform hover:scale-105"
              alt="Million Candles Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">
              {t("brand", "Million Candles")}
            </span>
          </Link>

          <div className="flex items-center lg:order-3 space-x-2">
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={toggleLangDropdown}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center transition-colors"
                aria-expanded={open.langDropdown}
              >
                <Globe className="w-5 h-5 mr-1" />
                <span className="mr-1">{currentLang.flag}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    open.langDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open.langDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center ${
                        currentLang.code === lang.code
                          ? "bg-gray-50 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            {/* <button
              onClick={toggleDarkMode}
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg text-sm p-2.5 flex items-center transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button> */}

            {/* Login Button */}
            <button
              onClick={handleOpenLogin}
              className="text-gray-800 dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 border border-gray-300 dark:border-gray-600 transition-colors"
            >
              {t("login", "Log in")}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={handleDrawer}
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={open.drawer}
            >
              <span className="sr-only">Toggle menu</span>
              {open.drawer ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Menu */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-2"
            id="desktop-menu"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {menus.map((menu, index) => {
                const isActive =
                  router.pathname === menu.url ||
                  (menu.url !== "/" && router.pathname.startsWith(menu.url));
                return (
                  <li key={index}>
                    <Link
                      href={menu.url}
                      className={`block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:p-0 dark:hover:bg-gray-700 lg:dark:hover:bg-transparent dark:border-gray-700 transition-colors relative
                        ${
                          isActive
                            ? "text-blue-600 dark:text-white font-semibold after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:dark:bg-white after:bottom-0 after:left-0"
                            : "text-gray-700 dark:text-gray-300 lg:hover:text-blue-600 dark:hover:text-white lg:dark:hover:text-white after:absolute after:w-0 after:h-0.5 after:bg-blue-600 after:dark:bg-white after:bottom-0 after:left-0 hover:after:w-full after:transition-all"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {menu.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
