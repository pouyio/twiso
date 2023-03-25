import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    VitePWA({
      registerType: 'prompt',
    }),
    visualizer({
      template: 'treemap',
      filename: 'stats.html',
    }) as PluginOption,
  ],
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
