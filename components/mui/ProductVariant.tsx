import React, { useState } from "react";

const productVariants = {
  colorOptions: [
    { label: "Putih", promo: false },
    { label: "Merah", promo: true },
    { label: "Kuning", promo: true },
    { label: "Hijau", promo: false },
    { label: "Oranye", promo: false },
    { label: "Biru", promo: false },
    { label: "Hitam", promo: false },
  ],
};

const ProductVariants = () => {
  const [selectedColor, setSelectedColor] = useState("Putih");

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  return (
    <>
      <div>
        <h2 className="font-semibold text-md mb-2">
          Pilih warna: <span className="text-green-500">{selectedColor}</span>
        </h2>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {productVariants.colorOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleColorChange(option.label)}
              className={`p-2 border text-sm rounded-lg text-center flex items-center justify-center 
                ${
                  selectedColor === option.label
                    ? "border-green-500 bg-green-100 text-green-500"
                    : "border-gray-300"
                } 
                ${option.promo ? "relative" : ""}`}
            >
              {option.label}
              {option.promo && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
                  %
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductVariants;
