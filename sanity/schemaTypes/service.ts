import { defineField, defineType } from "sanity";

// Mirrors lib/data/services.ts's Section type — see lib/cms/services.ts for
// how a document here maps back onto that shape (and what happens when this
// collection is empty: it falls back to the static array untouched).
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "ID (matches the anchor link, e.g. s01)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "index",
      title: "Index (e.g. 01)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Tag (e.g. INDUSTRIAL AUTOMATION)",
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
      name: "photo",
      title: "Photo",
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
      name: "imageLabel",
      title: "Placeholder label (shown only if no photo is set)",
      type: "string",
    }),
    defineField({
      name: "imageSize",
      title: "Placeholder size label (e.g. 800 x 600)",
      type: "string",
    }),
    defineField({
      name: "chips",
      title: "Chips (e.g. software/standards badges — optional)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "paragraphs",
      title: "Paragraphs",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "spec",
      title: "Spec rows (optional — e.g. Control Systems' tolerance table)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "value", type: "string" },
          ],
        },
      ],
    }),
  ],
  orderings: [
    { title: "Index", name: "indexAsc", by: [{ field: "index", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "index" },
  },
});
