import React from "react";
import ProductVariants from "components/mui/ProductVariant";
import ProductQuantitySelector from "./ProductQuantitySelector";
import SellerInformation from "./SellerInformation";
import { ProductDetailSkeleton } from "components/molecules/landing/ProductDetailSkeleton";

/**
 * Component for displaying product information
 */
const ProductInformation = ({
  isLoading,
  product,
  currentPrice,
  currentStock,
  handleVariantChange,
  qty,
  incrementQuantity,
  decrementQuantity,
  prepareOrderMessage,
}) => {
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="lg:w-1/2 w-full md:pl-10 py-6 lg:py-0 mt-6 lg:mt-0">
      <h1 className="text-gray-900 dark:text-gray-50 text-3xl title-font font-medium mb-1">
        {product.data[0].attributes.name} ({product.data[0].attributes.code})
      </h1>

      <p className="text-green-600 font-bold text-xl mb-4">{currentPrice}</p>

      <div className="mb-4">
        <ProductVariants
          product={product.data[0]}
          onVariantChange={handleVariantChange}
        />
      </div>

      <div className="mb-4">
        <span className="font-semibold">Stock: </span>
        {currentStock}
      </div>

      <div className="mb-4" style={{ whiteSpace: "pre-line" }}>
        {product.data[0].attributes.description}
      </div>

      <ProductQuantitySelector
        qty={qty}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        prepareOrderMessage={prepareOrderMessage}
      />

      <SellerInformation />
    </div>
  );
};

export default ProductInformation;
