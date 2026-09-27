// Defines which brief questions appear when a given service is selected.
// Every field has: name (key in brief object), label, type (text | textarea |
// select | file), and optional `options` for selects.

const SIGNAGE_FIELDS = [
  { name: "businessName", label: "Business Name", type: "text" },
  { name: "signText", label: "Sign Text", type: "text" },
  { name: "width", label: "Width", type: "text" },
  { name: "height", label: "Height", type: "text" },
  { name: "material", label: "Material", type: "text" },
  { name: "colors", label: "Preferred Colors", type: "text" },
  {
    name: "installationRequired",
    label: "Installation Required?",
    type: "select",
    options: ["Yes", "No"],
  },
  { name: "location", label: "Location", type: "text" },
  { name: "additionalRequirements", label: "Additional Requirements", type: "textarea" },
  { name: "referenceImage", label: "Reference Image", type: "file" },
];

const SOCIAL_MEDIA_FIELDS = [
  { name: "platform", label: "Platform", type: "select", options: ["Instagram", "Facebook", "TikTok", "LinkedIn", "Other"] },
  { name: "postType", label: "Post Type", type: "text" },
  { name: "content", label: "Content / Text", type: "textarea" },
  { name: "brandColors", label: "Brand Colors", type: "text" },
  { name: "requiredSize", label: "Required Size", type: "text" },
  { name: "cta", label: "Call To Action (CTA)", type: "text" },
  { name: "additionalRequirements", label: "Additional Requirements", type: "textarea" },
  { name: "referenceImage", label: "Image Upload", type: "file" },
];

const LOGO_FIELDS = [
  { name: "businessName", label: "Business Name", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "brandDescription", label: "Brand Description", type: "textarea" },
  { name: "preferredStyle", label: "Preferred Style", type: "text" },
  { name: "preferredColors", label: "Preferred Colors", type: "text" },
  { name: "competitorLinks", label: "Competitor / Reference Links", type: "text" },
  { name: "logoText", label: "Logo Text", type: "text" },
  { name: "referenceImage", label: "Reference Upload", type: "file" },
];

const BRANDING_FIELDS = [
  { name: "businessName", label: "Business Name", type: "text" },
  { name: "industry", label: "Industry", type: "text" },
  { name: "brandDescription", label: "Brand Description", type: "textarea" },
  { name: "preferredColors", label: "Preferred Colors", type: "text" },
  { name: "additionalRequirements", label: "Additional Requirements", type: "textarea" },
  { name: "referenceImage", label: "Reference Upload", type: "file" },
];

const PRODUCT_FIELDS = [
  { name: "content", label: "Content / Description", type: "textarea" },
  { name: "brandColors", label: "Brand Colors", type: "text" },
  { name: "requiredSize", label: "Required Size", type: "text" },
  { name: "additionalRequirements", label: "Additional Requirements", type: "textarea" },
  { name: "referenceImage", label: "Image Upload", type: "file" },
];

// Maps a service id to the field set it should use.
export const BRIEF_FIELDS_BY_SERVICE = {
  "led-sign": SIGNAGE_FIELDS,
  "acrylic-sign": SIGNAGE_FIELDS,
  "metal-sign": SIGNAGE_FIELDS,
  "shop-sign": SIGNAGE_FIELDS,
  "storefront-design": SIGNAGE_FIELDS,
  "3d-signage": SIGNAGE_FIELDS,
  "uv-dtf-design": SIGNAGE_FIELDS,

  "logo-design": LOGO_FIELDS,
  "brand-identity": BRANDING_FIELDS,
  "business-card": BRANDING_FIELDS,
  letterhead: BRANDING_FIELDS,
  "brand-guidelines": BRANDING_FIELDS,

  "instagram-post": SOCIAL_MEDIA_FIELDS,
  "facebook-post": SOCIAL_MEDIA_FIELDS,
  "instagram-story": SOCIAL_MEDIA_FIELDS,
  "ad-creative": SOCIAL_MEDIA_FIELDS,
  "promo-banner": SOCIAL_MEDIA_FIELDS,

  "product-visual": PRODUCT_FIELDS,
  "product-ad": PRODUCT_FIELDS,
  "product-banner": PRODUCT_FIELDS,
  "product-mockup": PRODUCT_FIELDS,
};

export function getBriefFieldsForService(serviceId) {
  return BRIEF_FIELDS_BY_SERVICE[serviceId] || BRANDING_FIELDS;
}
