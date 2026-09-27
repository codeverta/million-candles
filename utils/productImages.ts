const FALLBACK_PRODUCT_IMAGE = "/assets/image-1@2x.jpg";

export const toAbsoluteUrl = (url: string, pageUrl: string) => {
  if (!url) return url;
  try {
    return new URL(url, pageUrl).toString();
  } catch (_error) {
    return url;
  }
};

export const getProductImageUrls = (product: any, pageUrl: string) => {
  const productData = product?.data?.[0];
  if (!productData) return [];

  const relationships = productData.relationships?.documents?.data || [];
  const included = product.included || [];
  const filenames = relationships
    .map(
      (relationship: any) =>
        included.find(
          (document: any) =>
            document.id === relationship.id &&
            document.type === (relationship.type || "documents")
        )?.attributes?.filename
    )
    .filter(Boolean);
  const imagePaths = filenames.length ? filenames : [FALLBACK_PRODUCT_IMAGE];

  return imagePaths.map((imagePath: string) =>
    toAbsoluteUrl(imagePath, pageUrl)
  );
};
