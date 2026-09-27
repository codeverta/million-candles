import { Star } from "lucide-react";

const ProductReview = ({ product }) => {
  if (!product) return null;
  const productAttributes = product.data[0].attributes;
  const productReviews = productAttributes.product_reviews || [];
  return (
    <div className="mt-6 border-t pt-4 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Ulasan pelanggan
      </h3>
      {productReviews.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Belum ada ulasan untuk produk ini.
        </p>
      ) : (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {review.author_name || review.user?.name || "Pelanggan"}
                  </p>
                  <div className="flex text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          i < Number(review.rating) ? "currentColor" : "none"
                        }
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReview;
