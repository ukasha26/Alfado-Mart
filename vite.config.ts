import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ResolvedConfig } from "vite";
import { products } from "./src/data/products";
import { SITE_NAME, SITE_URL, trimDescription } from "./src/lib/seo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceById(html: string, tagName: "meta" | "link", id: string, replacement: string) {
  const pattern = new RegExp(`<${tagName}[^>]*id="${id}"[^>]*>`, "i");
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function buildProductPreviewHtml(template: string, productId: string) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return template;
  }

  const productUrl = `${SITE_URL}/product/${product.id}`;
  const productTitle = `${product.name} | ${SITE_NAME}`;
  const productDescription = trimDescription(product.description);
  const productImage = new URL(product.image, SITE_URL).toString();
  const productKeywords = Array.from(
    new Set([...(product.keywords ?? []), product.name, "shopping online", "buy now"])
  ).join(", ");

  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(productTitle)}</title>`);
  html = replaceById(
    html,
    "link",
    "seo-canonical",
    `<link id="seo-canonical" rel="canonical" href="${escapeHtml(productUrl)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-description",
    `<meta id="seo-description" name="description" content="${escapeHtml(productDescription)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-keywords",
    `<meta id="seo-keywords" name="keywords" content="${escapeHtml(productKeywords)}" />`
  );
  html = replaceById(html, "meta", "seo-og-type", `<meta id="seo-og-type" property="og:type" content="product" />`);
  html = replaceById(
    html,
    "meta",
    "seo-og-title",
    `<meta id="seo-og-title" property="og:title" content="${escapeHtml(productTitle)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-og-description",
    `<meta id="seo-og-description" property="og:description" content="${escapeHtml(productDescription)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-og-url",
    `<meta id="seo-og-url" property="og:url" content="${escapeHtml(productUrl)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-og-image",
    `<meta id="seo-og-image" property="og:image" content="${escapeHtml(productImage)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-og-image-alt",
    `<meta id="seo-og-image-alt" property="og:image:alt" content="${escapeHtml(product.name)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-twitter-title",
    `<meta id="seo-twitter-title" name="twitter:title" content="${escapeHtml(productTitle)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-twitter-description",
    `<meta id="seo-twitter-description" name="twitter:description" content="${escapeHtml(productDescription)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-twitter-image",
    `<meta id="seo-twitter-image" name="twitter:image" content="${escapeHtml(productImage)}" />`
  );
  html = replaceById(
    html,
    "meta",
    "seo-twitter-image-alt",
    `<meta id="seo-twitter-image-alt" name="twitter:image:alt" content="${escapeHtml(product.name)}" />`
  );

  return html;
}

function productPreviewPages(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "product-preview-pages",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async closeBundle() {
      const outDir = path.resolve(__dirname, config.build.outDir);
      const templatePath = path.join(outDir, "index.html");
      const template = await fs.readFile(templatePath, "utf8");

      await Promise.all(
        products.map(async (product) => {
          const routeDir = path.join(outDir, "product", product.id);
          const html = buildProductPreviewHtml(template, product.id);

          await fs.mkdir(routeDir, { recursive: true });
          await fs.writeFile(path.join(routeDir, "index.html"), html, "utf8");
        })
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), productPreviewPages()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
