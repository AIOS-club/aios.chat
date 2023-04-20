import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Pages from 'vite-plugin-pages';
import legacy from '@vitejs/plugin-legacy';
import svgLoader from '@andylacko/vite-svg-react-loader';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_URL,
    server: {
      host: '0.0.0.0',
      https: false,
      port: 5173,
      open: true,
    },
    build: {
      minify: 'terser',
      outDir: 'dist',
    },
    plugins: [
      react(),
      svgLoader(),
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
  }
});
