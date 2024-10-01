import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => {
  return {
    plugins: [svelte()],
    base: mode === 'production' ? '/acam-mapping-tool-public/' : '/',
  };
});
