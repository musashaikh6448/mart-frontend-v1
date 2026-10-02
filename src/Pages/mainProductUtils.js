export const normalizeProducts = (products) =>
  Array.isArray(products) ? products : [];

export const getProductDisplayName = (product) => {
  const rawName = product?.productName ?? "";
  return String(rawName).trim();
};

export const getProductImageUrls = (product) => {
  const imageURL = product?.imageURL;

  if (!Array.isArray(imageURL)) {
    return [];
  }

  return imageURL.filter(Boolean);
};
