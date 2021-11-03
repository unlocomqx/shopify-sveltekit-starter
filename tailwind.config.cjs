const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");

const config = {
  mode: "jit",
  purge: {
    content: [
      "./src/**/*.{html,svelte}",
    ],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(([_match, group, ..._rest]) => group),
      ],
    },
    // safelist: [/^svelte-[\d\w]+$/],
  },
  theme: {
    zIndex: {
      "above-modal": "520",
    },
    extend: {
      colors: {
        "favorite-field": "var(--p-surface-warning)",
        "favorite-field-contrast": "var(--color-favorite-field-text)",
        "common-field": "var(--p-surface-highlight)",
        "common-field-contrast": "var(--color-common-field-text)",
        "linked-field": "var(--p-surface-success)",
        "linked-field-contrast": "var(--color-linked-field-text)",
      },
      minWidth: {
        "60": "15rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

module.exports = config;
