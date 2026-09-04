import { sanityClient, configured } from "./client";
import { urlForImage } from "./image";
import { SECTIONS as STATIC_SECTIONS, type Section } from "@/lib/data/services";

const QUERY = `*[_type == "service"] | order(index asc) {
  id, index, tag, title, imageLabel, imageSize, photo, photoAlt, chips, paragraphs, spec
}`;

type ServiceDoc = {
  id: string;
  index: string;
  tag: string;
  title: string;
  imageLabel?: string;
  imageSize?: string;
  photo?: import("sanity").Image;
  photoAlt?: string;
  chips?: string[];
  paragraphs: string[];
  spec?: { label: string; value: string }[];
};

// Used by both app/services/page.tsx (the sticky sub-nav) and
// ServiceScroller — fetch once in the page and pass the result down, rather
// than each importing this (or lib/data/services.ts) separately, so they
// can never show a different set of sections than each other.
export async function getServiceSections(): Promise<Section[]> {
  if (!configured || !sanityClient) return STATIC_SECTIONS;

  try {
    const docs = await sanityClient.fetch<ServiceDoc[]>(
      QUERY,
      {},
      { next: { revalidate: 60, tags: ["service"] } }
    );
    if (!docs || docs.length === 0) return STATIC_SECTIONS;

    return docs.map((doc) => ({
      id: doc.id,
      index: doc.index,
      tag: doc.tag,
      title: doc.title,
      imageLabel: doc.imageLabel ?? "",
      imageSize: doc.imageSize ?? "",
      photo: doc.photo
        ? { src: urlForImage(doc.photo, 1200) ?? "", alt: doc.photoAlt || doc.title }
        : undefined,
      chips: doc.chips,
      paragraphs: doc.paragraphs,
      spec: doc.spec,
    }));
  } catch (err) {
    console.error("Sanity fetch failed for services — falling back to static data", err);
    return STATIC_SECTIONS;
  }
}
