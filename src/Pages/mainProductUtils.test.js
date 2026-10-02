import {
  getProductDisplayName,
  getProductImageUrls,
  normalizeProducts,
} from "./mainProductUtils";

describe("mainProductUtils", () => {
  it("normalizes missing product arrays safely", () => {
    expect(normalizeProducts(undefined)).toEqual([]);
    expect(normalizeProducts(null)).toEqual([]);
    expect(normalizeProducts([{ productName: "Tea" }])).toEqual([{ productName: "Tea" }]);
  });

  it("returns a safe display name for missing product names", () => {
    expect(getProductDisplayName({})).toBe("");
    expect(getProductDisplayName({ productName: "Green Tea" })).toBe("Green Tea");
  });

  it("returns only valid image URLs from a possibly invalid image list", () => {
    expect(getProductImageUrls({ imageURL: undefined })).toEqual([]);
    expect(getProductImageUrls({ imageURL: ["a.jpg", null, "b.jpg"] })).toEqual([
      "a.jpg",
      "b.jpg",
    ]);
  });
});
