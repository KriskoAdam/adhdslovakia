import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "clanky",
        label: "Články",
        path: "content/clanky",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Názov článku",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "date",
            label: "Dátum (napr. 5. júna 2025)",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Kategória",
            options: [
              "Diagnóza",
              "Mýty",
              "Lieky",
              "Výskum",
              "Osobný príbeh",
              "Veda",
              "Životný štýl",
              "Zdroje",
            ],
            required: true,
          },
          {
            type: "string",
            name: "excerpt",
            label: "Perex (krátky popis)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "readTime",
            label: "Čas čítania (napr. 4 min čítania)",
          },
          {
            type: "image",
            name: "coverImage",
            label: "Titulný obrázok",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Obsah článku",
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/clanky/${document._sys.filename}`,
        },
      },
    ],
  },
});