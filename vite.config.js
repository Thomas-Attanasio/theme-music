import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Prevents Tauri loading errors
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  // Multi-Page configuration
  build: {
    rollupOptions: {
      input: {
        // Add the other pages when create
        login: resolve(__dirname, 'src/pages/auth/login/login.html'),
        register: resolve(__dirname, 'src/pages/auth/register/register.html'),
        profile: resolve(__dirname, 'src/pages/profile/profile.html'),
        home: resolve(__dirname, 'src/pages/home/home.html')
      },
    },
  },
});