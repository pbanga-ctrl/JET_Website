import { sanityClient, configured } from "./client";
import { urlForImage } from "./image";
import {
  PRODUCTS as STATIC_PRODUCTS,
  OEM_PRODUCTS as STATIC_OEM_PRODUCTS,
  type Product,
} from "@/lib/data/products";

const QUERY = `*[_type == "product"] | order(order asc) {
  slug, tag, title, code, body, photo, photoAlt, group
}`;

type ProductDoc = {
  slug: string;
  tag: string;
  title: string;
  code?: string;
  body: string;
  photo?: import("sanity").Image;
  photoAlt?: string;
  group: "Jet product" | "OEM tech";
};

function toProduct(doc: ProductDoc): Product {
  return {
    slug: doc.slug,
    tag: doc.tag,
    title: doc.title,
    code: doc.code,
    body: doc.body,
    image: doc.photo
      ? { src: urlForImage(doc.photo, 800) ?? "", alt: doc.photoAlt || doc.title }
      : undefined,
  };
}

// Falls back per-group, not just wholesale — if only OEM tech has been
// entered into the CMS so far, the Jet Products carousel still shows the
// static list rather than going empty.
export async function getProducts(): Promise<{ products: Product[]; oemProducts: Product[] }> {
  if (!configured || !sanityClient) {
    return { products: STATIC_PRODUCTS, oemProducts: STATIC_OEM_PRODUCTS };
  }

  try {
    const docs = await sanityClient.fetch<ProductDoc[]>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["product"] } }
    );
    const jetDocs = docs.filter((d) => d.group === "Jet product");
    const oemDocs = docs.filter((d) => d.group === "OEM tech");

    return {
      products: jetDocs.length > 0 ? jetDocs.map(toProduct) : STATIC_PRODUCTS,
      oemProducts: oemDocs.length > 0 ? oemDocs.map(toProduct) : STATIC_OEM_PRODUCTS,
    };
  } catch (err) {
    console.error("Sanity fetch failed for products — falling back to static data", err);
    return { products: STATIC_PRODUCTS, oemProducts: STATIC_OEM_PRODUCTS };
  }
}
