export const SITE_NAME = "Alfado Mart";
export const SITE_URL = "https://alfadomart.store";

export const DEFAULT_TITLE = "Alfado Mart - Premium Online Marketplace";
export const DEFAULT_DESCRIPTION =
  "Shop electronics, fashion, home essentials, and more at Alfado Mart, Pakistan's multi-vendor online marketplace.";
export const DEFAULT_KEYWORDS = [
  "Alfado Mart",
  "online shopping Pakistan",
  "multi-vendor marketplace",
  "e-commerce store",
  "electronics shopping",
  "fashion store",
  "home essentials",
  "buy online",
];
export const DEFAULT_IMAGE_PATH = "/products/headphones.jpg";

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

export interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonicalUrl?: string;
  canonicalPath?: string;
  pageType?: SeoPageType;
  productDetails?: SeoProductDetails | null;
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

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
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
}: Pick<SeoProps, "pageType" | "productDetails" | "canonicalUrl" | "description">) {
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
    ],
  };
}
