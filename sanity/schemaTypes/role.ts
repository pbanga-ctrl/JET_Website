import { defineField, defineType } from "sanity";

// Mirrors lib/data/roles.ts's Role type + OPEN_ROLE_SLUGS — `open` here
// replaces that separate slug list (see lib/cms/roles.ts).
export const role = defineType({
  name: "role",
  title: "Job Role",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug (used in the URL, e.g. controls)",
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
      name: "type",
      title: "Type (e.g. Full-time, Contract)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dept",
      title: "Department",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "blurb",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duties",
      title: "Responsibilities",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "reqs",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "open",
      title: "Show on the open-roles list",
      type: "boolean",
      description:
        "Off = still reachable by direct link (e.g. a general-application page) but not listed on /careers.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "dept" },
  },
});
