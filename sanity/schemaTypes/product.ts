import { defineField, defineType } from "sanity";

// Mirrors lib/data/products.ts's Product type. `group` replaces the two
// separate PRODUCTS/OEM_PRODUCTS arrays that file exports — lib/cms/products.ts
// splits documents back into those two lists by this field.
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Category tag (e.g. MATERIAL HANDLING)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code / brand name (e.g. X45C) — optional",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo (falls back to the placeholder drawing if empty)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "photoAlt",
      title: "Photo alt text",
      type: "string",
      hidden: ({ document }) => !document?.photo,
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: { list: ["Jet product", "OEM tech"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order (lower shows first within its group)",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "group" },
  },
});
