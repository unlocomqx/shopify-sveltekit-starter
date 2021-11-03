#!/usr/bin/env zx

await $`dotenv -e .env.test -- prisma migrate reset --force`;
await $`dotenv -e .env.test -- prisma db push --accept-data-loss`;
await $`psql --username postgres test_dynamicproduct < ./cypress/seeds/base.sql`;
