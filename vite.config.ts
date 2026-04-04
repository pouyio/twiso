import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import EnvironmentPlugin from 'vite-plugin-environment';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
    }),
    visualizer({
      template: 'treemap',
      filename: 'stats.html',
    }) as PluginOption,
    EnvironmentPlugin('all'),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: true,
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
});
