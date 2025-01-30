import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import EnvironmentPlugin from 'vite-plugin-environment';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    viteTsconfigPaths(),
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
  build: {
    sourcemap: true,
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
});
