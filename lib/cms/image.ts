import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset } from "@/sanity/env";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

// Turns a Sanity image reference into an actual URL, sized for how it'll be
// displayed. Returns null (rather than throwing) when there's no image or
// no project configured yet, so callers can just fall back to a placeholder.
export function urlForImage(source: Image | undefined, width: number) {
  if (!source || !builder) return null;
  return builder.image(source).width(width).fit("max").auto("format").url();
}
