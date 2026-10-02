import { matchesProductSearch } from "./productListUtils";

describe("matchesProductSearch", () => {
  it("handles products with missing productName or productCategory without throwing", () => {
    const product = {
      productName: undefined,
      productCategory: null,
      approved: true,
      dealOfDay: false,
    };

    expect(() => matchesProductSearch(product, "tea", "", "")).not.toThrow();
    expect(matchesProductSearch(product, "tea", "", "")).toBe(false);
    expect(matchesProductSearch(product, "", "", "")).toBe(true);
  });

  it("matches a product when search text matches a valid field", () => {
    const product = {
      productName: "Green Tea",
      productCategory: undefined,
      approved: true,
      dealOfDay: false,
    };

    expect(matchesProductSearch(product, "green", "", "")).toBe(true);
  });
});
