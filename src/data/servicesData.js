// Static catalog of every service DesignFlow offers, grouped by category.
// `id` values are used everywhere else (projects, quotes) to reference a service.
export const SERVICE_CATEGORIES = [
  {
    category: "Branding",
    services: [
      { id: "logo-design", name: "Logo Design" },
      { id: "brand-identity", name: "Brand Identity" },
      { id: "business-card", name: "Business Card" },
      { id: "letterhead", name: "Letterhead" },
      { id: "brand-guidelines", name: "Brand Guidelines" },
    ],
  },
  {
    category: "Social Media Design",
    services: [
      { id: "instagram-post", name: "Instagram Post" },
      { id: "facebook-post", name: "Facebook Post" },
      { id: "instagram-story", name: "Instagram Story" },
      { id: "ad-creative", name: "Advertisement Creative" },
      { id: "promo-banner", name: "Promotional Banner" },
    ],
  },
  {
    category: "Product / E-commerce Design",
    services: [
      { id: "product-visual", name: "Product Visual" },
      { id: "product-ad", name: "Product Advertisement" },
      { id: "product-banner", name: "Product Banner" },
      { id: "product-mockup", name: "Product Mockup" },
    ],
  },
  {
    category: "Signage",
    services: [
      { id: "led-sign", name: "LED Sign" },
      { id: "acrylic-sign", name: "Acrylic Sign" },
      { id: "metal-sign", name: "Metal Sign" },
      { id: "shop-sign", name: "Shop Sign" },
      { id: "storefront-design", name: "Storefront Design" },
      { id: "3d-signage", name: "3D Signage" },
      { id: "uv-dtf-design", name: "UV-DTF Design" },
    ],
  },
];

/** Flat list of every service, useful for dropdowns and lookups by id. */
export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.services.map((s) => ({ ...s, category: cat.category }))
);

export function getServiceById(id) {
  return ALL_SERVICES.find((s) => s.id === id) || null;
}
