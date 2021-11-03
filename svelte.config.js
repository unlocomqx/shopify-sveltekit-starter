import preprocess from "svelte-preprocess";
import { replaceCodePlugin } from "vite-plugin-replace";
import dotenv from "dotenv";
import { resolve } from "path";
import adapter from "@sveltejs/adapter-static";


dotenv.config(Number(process.env.TEST) ? { path: resolve(process.cwd(), ".env.test") } : null);

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess({
    sourceMap: true,
    "postcss": true,
  })],

  kit: {
    target: "#svelte",

    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: null,
    }),

    prerender: {
      enabled: false,
    },
    ssr: false,

    vite: {
      logLevel: "error",
      ssr: {
        noExternal: [
          "svelte-portal",
          "tinymce",
        ],
      },
      optimizeDeps: {
        include: [
          "@apollo/client/core/core.cjs.js",
          "@apollo/client/apollo-client.cjs.js",
          "@apollo/client/core/index.js",
          "@prisma/client",
          "@shopify/admin-graphql-api-utilities",
          "@shopify/app-bridge",
          "@shopify/app-bridge-utils",
          "@shopify/app-bridge/actions/index.js",
          "@simonwep/pickr/dist/pickr.es5.min",
          "copy-to-clipboard",
          "debug",
          "deepmerge",
          "glightbox",
          "excel-formula",
          "highlight.js/lib/core",
          "highlight.js/lib/languages/excel",
          "hyperformula",
          "loadcss",
          "lodash.debounce",
          "lodash.unescape",
          "nouislider",
          "quill",
          "svelte-apollo-client",
          "svelte-local-storage-store",
          "svelte-portal",
          "tippy.js",
          "vegemite",
          "yup",
        ],
      },
      server: {
        hmr: {
          host: "localhost",
          protocol: "ws",
        },
      },
      resolve: {
        alias: {
          "@shopify/shopify-api/dist/error": "@shopify/shopify-api/dist/error.js",
          ".prisma": "/node_modules/.prisma",
          "@ProductConfig": "/src/lib/product-config",
          "@utils": "/src/lib/utils",
          "@product": "/src/lib/product",
          "@interfaces": "/src/lib/interfaces",
          "@scss": resolve("src/scss"),
        },
      },
      plugins: [
        replaceCodePlugin({
          replacements: [
            {
              from: /process.env.SHOPIFY_API_KEY/g,
              to: JSON.stringify(process.env.SHOPIFY_API_KEY),
            },
            {
              from: /process.env.SHOPIFY_API_SECRET/g,
              to: JSON.stringify(process.env.SHOPIFY_API_SECRET),
            },
            {
              from: /process.env.SHOP/g,
              to: JSON.stringify(process.env.SHOP),
            },
            {
              from: /process.env.ID_HOST/g,
              to: JSON.stringify(process.env.ID_HOST),
            },
            {
              from: /process.env.HOST/g,
              to: JSON.stringify(process.env.HOST),
            },
            {
              from: /process.env.TEST/g,
              to: process.env.TEST ? JSON.stringify(process.env.TEST) : 0,
            },
            {
              from: /process.env.DATABASE_URL/g,
              to: JSON.stringify(process.env.DATABASE_URL),
            },
          ],
        }),
      ],
    },
  },
};

export default config;

