export const SITE_NAME = "Alfado Mart";
export const SITE_URL = "https://alfadomart.store";

export const DEFAULT_TITLE = "Alfado Mart | Kitchen Tools, Beauty & Hair Care Products Pakistan";
export const DEFAULT_DESCRIPTION =
  "Shop kitchen essentials, night creams, hair growth sprays and more at Alfado Mart with secure checkout, fast support, and free home delivery across Pakistan.";
export const DEFAULT_KEYWORDS = [
  "Alfado Mart",
  "Multi Functional Vegetable Cutter",
  "Stainless Steel Vegetable Cutter",
  "night cream Pakistan",
  "hair growth spray",
  "rosemary water spray",
  "vegetable cutter Pakistan",
  "kitchen tools online",
  "beauty products online",
  "free home delivery",
  "buy online",
  "Alfado Mart products",
];
export const DEFAULT_IMAGE_PATH = "/products/vegetable-cutter-1.jpeg";

export type SeoPageType = "website" | "product" | "article";

export interface SeoProductDetails {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock";
  sku?: string;
  brand?: string;
  url?: string;
}

export type SeoFeaturedProduct = SeoProductDetails;

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalUrl?: string;
  canonicalPath?: string;
  pageType?: SeoPageType;
  productDetails?: SeoProductDetails | null;
  featuredProducts?: SeoFeaturedProduct[];
}

export function toAbsoluteUrl(value: string | undefined, baseUrl = SITE_URL) {
  if (!value) return baseUrl;

  try {
    return new URL(value).toString();
  } catch {
    const normalizedValue = value.startsWith("/") ? value : `/${value}`;
    return new URL(normalizedValue, baseUrl).toString();
  }
}

export function trimDescription(value: string, maxLength = 155) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

export function buildCanonicalUrl({
  canonicalUrl,
  canonicalPath,
}: Pick<SeoProps, "canonicalUrl" | "canonicalPath">) {
  if (canonicalUrl) return toAbsoluteUrl(canonicalUrl);

  if (canonicalPath) {
    return toAbsoluteUrl(canonicalPath);
  }

  if (typeof window !== "undefined") {
    return new URL(window.location.pathname, SITE_URL).toString();
  }

  return SITE_URL;
}

export function buildMetaKeywords(keywords?: string[], productName?: string) {
  const combined = keywords && keywords.length > 0 ? keywords : DEFAULT_KEYWORDS;

  if (!productName) {
    return combined;
  }

  return Array.from(new Set([...combined, productName, "shopping online", "buy now"]));
}

export function buildStructuredData({
  pageType,
  productDetails,
  canonicalUrl,
  description,
  featuredProducts,
}: Pick<SeoProps, "pageType" | "productDetails" | "canonicalUrl" | "description" | "featuredProducts">) {
  if (pageType === "product" && productDetails) {
    const resolvedUrl = productDetails.url
      ? toAbsoluteUrl(productDetails.url)
      : buildCanonicalUrl({ canonicalUrl });

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productDetails.name,
      image: [toAbsoluteUrl(productDetails.image)],
      description: trimDescription(productDetails.description || description || DEFAULT_DESCRIPTION),
      sku: productDetails.sku ?? productDetails.name,
      brand: {
        "@type": "Brand",
        name: productDetails.brand ?? SITE_NAME,
      },
      offers: {
        "@type": "Offer",
        url: resolvedUrl,
        priceCurrency: productDetails.currency ?? "PKR",
        price: productDetails.price.toFixed(2),
        availability: `https://schema.org/${productDetails.availability ?? "InStock"}`,
        itemCondition: "https://schema.org/NewCondition",
      },
    };
  }

  const websiteUrl = buildCanonicalUrl({ canonicalUrl });

  const featuredItems = featuredProducts?.length
    ? {
        "@type": "ItemList",
        "@id": `${websiteUrl}#featured-products`,
        name: `${SITE_NAME} featured products`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: featuredProducts.length,
        itemListElement: featuredProducts.map((product, index) => {
          const resolvedProductUrl = product.url
            ? toAbsoluteUrl(product.url)
            : `${websiteUrl}#product-${index + 1}`;

          return {
            "@type": "ListItem",
            position: index + 1,
            url: resolvedProductUrl,
            item: {
              "@type": "Product",
              name: product.name,
              image: [toAbsoluteUrl(product.image)],
              description: trimDescription(product.description || description || DEFAULT_DESCRIPTION),
              sku: product.sku ?? product.name,
              brand: {
                "@type": "Brand",
                name: product.brand ?? SITE_NAME,
              },
              offers: {
                "@type": "Offer",
                url: resolvedProductUrl,
                priceCurrency: product.currency ?? "PKR",
                price: product.price.toFixed(2),
                availability: `https://schema.org/${product.availability ?? "InStock"}`,
                itemCondition: "https://schema.org/NewCondition",
              },
            },
          };
        }),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${websiteUrl}#organization`,
        name: SITE_NAME,
        url: websiteUrl,
        logo: toAbsoluteUrl("/favicon.svg"),
      },
      {
        "@type": "WebSite",
        "@id": `${websiteUrl}#website`,
        name: SITE_NAME,
        url: websiteUrl,
        description: trimDescription(description || DEFAULT_DESCRIPTION),
        publisher: {
          "@id": `${websiteUrl}#organization`,
        },
      },
      ...(featuredItems ? [featuredItems] : []),
    ],
  };
}
