import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Palette,
  Leaf,
  Star,
  Heart,
  ShoppingCart,
  Play,
} from "lucide-react";

const CandleShowcase = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("white");

  const colors = [
    { name: "white", color: "#ffffff", label: "Putih" },
    { name: "red", color: "#dc2626", label: "Merah" },
    { name: "pink", color: "#ec4899", label: "Pink" },
    { name: "purple", color: "#9333ea", label: "Ungu" },
    { name: "blue", color: "#2563eb", label: "Biru" },
    { name: "green", color: "#059669", label: "Hijau" },
    { name: "yellow", color: "#eab308", label: "Kuning" },
    { name: "orange", color: "#ea580c", label: "Oranye" },
  ];

  const images = [
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=600&fit=crop",
  ];

  const features = [
    { icon: Clock, title: "Tahan Lama", desc: "Hingga 8 jam nyala" },
    { icon: Palette, title: "Desain Elegan", desc: "Tekstur marble premium" },
    {
      icon: Leaf,
      title: "Ramah Lingkungan",
      desc: "Stearin berkualitas tinggi",
    },
    { icon: Star, title: "Multi Warna", desc: "Berbagai pilihan warna" },
  ];

  const occasions = [
    {
      title: "Pernikahan",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=200&fit=crop",
    },
    {
      title: "Ibadah",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    },
    {
      title: "Dinner Romantis",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop",
    },
    {
      title: "Relaksasi",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-amber-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Million <span className="text-orange-600">Candles</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Lilin Kristal Premium dengan Desain Elegan dan Daya Tahan Luar
              Biasa
            </p>
          </div>

          {/* Main Product Showcase */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
                <img
                  src={images[currentImageIndex]}
                  alt="Lilin Million Candles"
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex space-x-4 mt-6 justify-center">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                      index === currentImageIndex
                        ? "ring-4 ring-orange-500 scale-110"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Lilin Kristal Premium
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Lilin kristal dari Million Candles hadir dengan desain yang
                  elegan dan daya tahan hingga 8 jam. Cocok untuk mempercantik
                  dekorasi ruangan atau memberikan suasana yang tenang dan
                  nyaman. Terbuat dari bahan stearin yang ramah lingkungan.
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Pilih Warna Favorit Anda
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {colors.map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => setSelectedColor(colorOption.name)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedColor === colorOption.name
                          ? "border-orange-500 ring-4 ring-orange-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 shadow-lg"
                        style={{
                          backgroundColor: colorOption.color,
                          border:
                            colorOption.name === "white"
                              ? "2px solid #e5e7eb"
                              : "none",
                        }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">
                        {colorOption.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Spesifikasi Produk
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tinggi:</span>
                      <span className="font-medium">20 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diameter:</span>
                      <span className="font-medium">2.3 cm</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Berat:</span>
                      <span className="font-medium">190 gram</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bahan:</span>
                      <span className="font-medium">Stearin</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 italic">
                    *Sticker label dapat dilepas
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Tambah ke Keranjang</span>
                </button>
                <button className="p-4 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200 hover:scale-105">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Keunggulan Produk
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Lihat Lilin Kami Beraksi
          </h2>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=450&fit=crop"
              alt="Video Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button className="bg-white/90 hover:bg-white p-6 rounded-full transition-all duration-200 hover:scale-110 shadow-xl">
                <Play className="w-12 h-12 text-orange-600 ml-1" />
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                Panduan Penggunaan & Review
              </h3>
              <p className="text-white/80">Durasi: 3 menit 45 detik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Occasions */}
      <div className="py-20 bg-gradient-to-r from-orange-100 to-amber-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perfect untuk Setiap Momen Spesial
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lilin premium kami cocok untuk berbagai acara dan suasana yang
              ingin Anda ciptakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {occasions.map((occasion, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={occasion.image}
                    alt={occasion.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center group-hover:text-orange-600 transition-colors duration-200">
                  {occasion.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rasakan Perbedaannya Sekarang!
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Dapatkan lilin premium dengan kualitas terbaik untuk momen spesial
            Anda
          </p>
          <button className="bg-white text-orange-600 py-4 px-12 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg inline-flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6" />
            <span>Pesan Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandleShowcase;
