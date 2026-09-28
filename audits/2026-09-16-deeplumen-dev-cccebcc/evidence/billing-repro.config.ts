import base from './repo/apps/shopify-app/vitest.config';
export default {
  ...base,
  root: '/tmp/shopify-deeplumen-bfs-20260916.4YK5eB',
  resolve: {
    ...base.resolve,
    alias: {
      ...base.resolve?.alias,
      vitest: '/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo/apps/shopify-app/node_modules/vitest/dist/index.js',
    },
  },
  test: {
    ...base.test,
    include: ['billing-repro.test.ts'],
    setupFiles: ['/tmp/shopify-deeplumen-bfs-20260916.4YK5eB/repo/apps/shopify-app/tests/vitest.setup.ts'],
  },
};
