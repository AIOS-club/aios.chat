import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import legacy from '@vitejs/plugin-legacy';
import svgLoader from '@andylacko/vite-svg-react-loader';

import { name } from './package.json';

export function resolveTemplateEnv(envs: string[] = []) {
  const defaultKey = [
    'NODE_ENV',
    'ENV',
    'COMMIT_VERSION',
    'CI_DEV_BRANCH',
    'CI_WORKBENCH_ID',
  ];
  const env: { [key in string]: string } = {};
  Object.keys(process.env).forEach((key) => {
    if (defaultKey.includes(key) || envs.includes(key)) {
      env[key] = process.env[key] as string;
    }
  });
  env.BASE_URL = getPublicPath();

  return {
    process: { env: env },
  };
}

function getBasePath() {
  if (!process.env.ENV || process.env.ENV === 'PROD') return '/';
  if (process.env.CI_WORKBENCH_ID) return '/';

  // 依赖ci-env环境变量
  return (
    (process.env.CI_PROJECT_NAMESPACE
      ? '/' + process.env.CI_PROJECT_NAMESPACE.split('/').join('-')
      : '') +
    '/' +
    process.env.CI_APP_NAME +
    '/'
  );
}

function getPublicPath() {
  if (process.env.ENV === 'PROD')
    // TODO 需要修改
    return 'https://acdnpy.pandateacher.com/' + name;

  return getBasePath();
}

export default defineConfig({
  base: getPublicPath(),
  server: {
    host: '0.0.0.0',
    https: false,
    port: 5173,
    open: true,
    proxy: {
      '/biz': {
        target: 'https://test.pandateacher.com',
        changeOrigin: true,
      },
    },
  },
  define: {
    ENV: JSON.stringify(process.env.ENV || 'local').toLocaleLowerCase(),
    BASE: JSON.stringify(getBasePath()),
    'process.env': {},
    COMMIT_VERSION: JSON.stringify(
      process.env['ref'] ||
        process.env['COMMIT_VERSION'] ||
        process.env['RELEASE_VERSION'] ||
        process.env['CI_COMMIT_REF_NAME'] ||
        process.env['CI_COMMIT_ID'] ||
        ''
    ),
    APP_ENV: JSON.stringify(process.env.ENV || 'local').toLocaleLowerCase(),
  },
  build: {
    minify: 'terser',
    // rollupOptions: {
    //   output: {},
    // },
  },
  plugins: [
    react(),
    svgLoader(),
    // https://github.com/vbenjs/vite-plugin-html
    createHtmlPlugin({
      inject: {
        data: { projectName: name, ...resolveTemplateEnv() },
      },
    }),
    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      exclude: ['**/components/**/*'],
    }),
    // https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
    legacy({
      targets: ['defaults', 'not IE 11'],
      // polyfills: ['es.array.at', 'es.string.match-all'],
      // modernPolyfills: [],
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['react', 'react-router-dom'],
      dts: true,
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`,
      '@': resolve(__dirname, 'src'),
    },
  },
});
