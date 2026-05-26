import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE_PATH,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  buildCanonicalUrl,
  buildMetaKeywords,
  buildStructuredData,
  trimDescription,
  toAbsoluteUrl,
  type SeoProps,
} from "@/lib/seo";

type ManagedElementSnapshot = {
  element: HTMLElement;
  attributes: Array<[string, string]>;
  textContent: string | null;
  created: boolean;
};

function syncElement(
  tagName: "meta" | "link" | "script",
  id: string,
  attributes: Record<string, string>,
  textContent?: string
) {
  const existing = document.getElementById(id) as HTMLElement | null;
  const snapshot: ManagedElementSnapshot = {
    element: existing ?? document.createElement(tagName),
    attributes: existing
      ? Array.from(existing.attributes).map((attribute) => [attribute.name, attribute.value])
      : [],
    textContent: existing?.textContent ?? null,
    created: !existing,
  };

  if (!existing) {
    snapshot.element.id = id;
    document.head.appendChild(snapshot.element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    snapshot.element.setAttribute(name, value);
  });

  if (typeof textContent === "string") {
    snapshot.element.textContent = textContent;
  }

  return () => {
    if (snapshot.created) {
      snapshot.element.remove();
      return;
    }

    Array.from(snapshot.element.attributes).forEach((attribute) => {
      snapshot.element.removeAttribute(attribute.name);
    });

    snapshot.attributes.forEach(([name, value]) => {
      snapshot.element.setAttribute(name, value);
    });

    snapshot.element.textContent = snapshot.textContent;
  };
}

export function Seo({
  title,
  description,
  keywords,
  image,
  canonicalUrl,
  canonicalPath,
  pageType = "website",
  productDetails,
}: SeoProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const resolvedCanonicalUrl = buildCanonicalUrl({ canonicalUrl, canonicalPath });
    const resolvedProductName = productDetails?.name;
    const resolvedTitle =
      title ||
      (pageType === "product" && resolvedProductName
        ? `${resolvedProductName} | ${SITE_NAME}`
        : DEFAULT_TITLE);
    const resolvedDescription = trimDescription(
      description || productDetails?.description || DEFAULT_DESCRIPTION
    );
    const resolvedImage = toAbsoluteUrl(
      image || productDetails?.image || DEFAULT_IMAGE_PATH
    );
    const resolvedKeywords = buildMetaKeywords(
      keywords && keywords.length > 0 ? keywords : DEFAULT_KEYWORDS,
      resolvedProductName
    ).join(", ");
    const resolvedJsonLd = buildStructuredData({
      pageType,
      productDetails,
      canonicalUrl: resolvedCanonicalUrl,
      description: resolvedDescription,
    });

    const restorers = [
      (() => {
        const previousTitle = document.title;
        document.title = resolvedTitle;
        return () => {
          document.title = previousTitle;
        };
      })(),
      syncElement("meta", "seo-description", {
        name: "description",
        content: resolvedDescription,
      }),
      syncElement("meta", "seo-keywords", {
        name: "keywords",
        content: resolvedKeywords,
      }),
      syncElement("meta", "seo-robots", {
        name: "robots",
        content: "index, follow",
      }),
      syncElement("link", "seo-canonical", {
        rel: "canonical",
        href: resolvedCanonicalUrl,
      }),
      syncElement("meta", "seo-og-type", {
        property: "og:type",
        content: pageType === "product" ? "product" : pageType,
      }),
      syncElement("meta", "seo-og-title", {
        property: "og:title",
        content: resolvedTitle,
      }),
      syncElement("meta", "seo-og-description", {
        property: "og:description",
        content: resolvedDescription,
      }),
      syncElement("meta", "seo-og-url", {
        property: "og:url",
        content: resolvedCanonicalUrl,
      }),
      syncElement("meta", "seo-og-image", {
        property: "og:image",
        content: resolvedImage,
      }),
      syncElement("meta", "seo-og-site-name", {
        property: "og:site_name",
        content: SITE_NAME,
      }),
      syncElement("meta", "seo-twitter-card", {
        name: "twitter:card",
        content: "summary_large_image",
      }),
      syncElement("meta", "seo-twitter-title", {
        name: "twitter:title",
        content: resolvedTitle,
      }),
      syncElement("meta", "seo-twitter-description", {
        name: "twitter:description",
        content: resolvedDescription,
      }),
      syncElement("meta", "seo-twitter-image", {
        name: "twitter:image",
        content: resolvedImage,
      }),
      syncElement(
        "script",
        "seo-json-ld",
        {
          type: "application/ld+json",
        },
        JSON.stringify(resolvedJsonLd)
      ),
    ];

    return () => {
      for (let index = restorers.length - 1; index >= 0; index -= 1) {
        restorers[index]();
      }
    };
  }, [
    canonicalPath,
    canonicalUrl,
    description,
    image,
    keywords,
    pageType,
    productDetails,
    title,
  ]);

  return null;
}
