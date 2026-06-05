import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'KriskoAdam/adhdslovakia',
  },
  ui: {
    brand: { name: 'ADHD Slovakia' },
  },
  collections: {
    clanky: collection({
      label: 'Články',
      slugField: 'title',
      path: 'content/clanky/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Názov článku' } }),
        date: fields.date({ label: 'Dátum publikovania' }),
        category: fields.select({
          label: 'Kategória',
          options: [
            { label: 'Diagnóza', value: 'Diagnóza' },
            { label: 'Mýty', value: 'Mýty' },
            { label: 'Lieky', value: 'Lieky' },
            { label: 'Výskum', value: 'Výskum' },
            { label: 'Osobný príbeh', value: 'Osobný príbeh' },
            { label: 'Veda', value: 'Veda' },
            { label: 'Zdroje', value: 'Zdroje' },
            { label: 'Životný štýl', value: 'Životný štýl' },
          ],
          defaultValue: 'Diagnóza',
        }),
        excerpt: fields.text({ label: 'Perex (krátky popis)', multiline: true }),
        readTime: fields.text({ label: 'Čas čítania (napr. 5 min čítania)' }),
        coverImage: fields.image({
          label: 'Titulný obrázok',
          directory: 'public/images',
          publicPath: '/images',
        }),
        content: fields.markdoc({ label: 'Obsah článku' }),
      },
    }),
  },
});