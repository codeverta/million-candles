import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ChevronDown, Globe } from "lucide-react";
// import { i18n } from "next-i18next"; // i18n tidak diperlukan di sini

// Definisikan tipe untuk bahasa
interface Language {
  code: string;
  name: string;
  flag: string;
}

// Definisikan daftar bahasa
const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ar", name: "Standard Arabic", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "kr", name: "한국어", flag: "🇰🇷" },
  { code: "th", name: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export default function LanguageDropdown() {
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router;

  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(
    languages.find((lang) => lang.code === locale) || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const changeLanguage = (newLocale: string) => {
    // 1. Ambil path utama tanpa query string.
    const pathOnly = asPath.split("?")[0];

    // 2. Bagi path menjadi segmen. Filter segmen kosong (dari / di awal/akhir)
    const segments = pathOnly.split("/").filter((s) => s.length > 0);

    // 3. Logika Pembersihan Awal: Filter semua segmen yang merupakan kode bahasa yang valid (locale ganda).
    const localesList = locales || [];
    let cleanSegments = segments.filter(
      (segment) => !localesList.includes(segment)
    );

    // 4. Logika Khusus: Jika path adalah post, hapus slug-nya.
    // Contoh: segments awal ["id", "posts", "slug-judul"]
    // cleanSegments menjadi ["posts", "slug-judul"]
    if (cleanSegments[0] === "posts" && cleanSegments.length > 1) {
      // Jika segmen pertama adalah 'posts' DAN ada segmen lain setelahnya (yaitu slug),
      // maka kita hanya ambil segmen 'posts'.
      cleanSegments = ["posts"];
    }
    // Jika hanya ["posts"], cleanSegments tetap ["posts"].
    // Jika hanya ["about"], cleanSegments tetap ["about"].

    // 5. Konstruksi ulang targetPath: path bersih + query string
    let targetPath = `/${cleanSegments.join("/")}`;

    // Tambahkan kembali query string jika ada
    const queryString = asPath.includes("?")
      ? asPath.substring(asPath.indexOf("?"))
      : "";
    targetPath += queryString;

    // Pastikan path minimal adalah '/'
    if (targetPath === "") {
      targetPath = "/";
    }

    // 6. Lakukan redirect
    router.push(
      {
        pathname: pathname,
        query: query,
      },
      targetPath, // URL yang ditampilkan di address bar (sudah bersih dari locale ganda & slug)
      {
        locale: newLocale, // Next.js akan menambahkan locale baru
        scroll: false,
      }
    );
  };

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setIsOpen(false);
    changeLanguage(lang.code);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 font-medium rounded-lg text-sm px-3 py-2 flex items-center transition-colors"
        aria-expanded={isOpen}
      >
        <span className="mr-1">
          {currentLang.flag} {currentLang.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
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
  );
}
