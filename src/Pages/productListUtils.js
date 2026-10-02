export const matchesProductSearch = (
  product,
  searchInput,
  filterByApproved,
  filterByDealOfDay
) => {
  const normalizedSearch = (searchInput || "").toLowerCase();

  const productName = product?.productName ?? "";
  const productCategory = product?.productCategory ?? "";

  const productNameMatch = String(productName).toLowerCase().includes(normalizedSearch);
  const productCategoryMatch = String(productCategory)
    .toLowerCase()
    .includes(normalizedSearch);

  const approvedMatch =
    filterByApproved === "" ||
    String(product?.approved ?? "") === filterByApproved;
  const dealOfDayMatch =
    filterByDealOfDay === "" ||
    String(product?.dealOfDay ?? "") === filterByDealOfDay;

  return (
    (productNameMatch || productCategoryMatch) &&
    approvedMatch &&
    dealOfDayMatch
  );
};
