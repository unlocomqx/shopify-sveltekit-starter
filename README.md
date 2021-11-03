# Shopify App template

This template is based on Sveltekit + Prisma + Tailwind + Polaris

## Setup

- Clone this repo

```shell
git clone https://github.com/unlocomqx/shopify-sveltekit-starter
# Or
npx degit https://github.com/unlocomqx/shopify-sveltekit-starter
```

- Install deps

```shell
yarn install
```

- Copy config files

```shell
cp .env.sample .env # Change the values in .env to values that correspond to your app
cp .env.sample .env.test # change TEST=0 to TEST=1
cp config.js.sample config.js
```

- Start the dev server

```shell
yarn run dev
```

- Install your app from the shopify partner interface (https://partners.shopify.com/)

## Requirement

- A postgresql server on localhost:5432
- A front.net proxy to localhost:8081 with
  https ([apache](https://dev.to/unlocomqx/a-much-better-dx-for-shopify-apps-38ln)
  / [nginx](https://superuser.com/a/1674341/67862)) / Otherwise you can use ngrok
