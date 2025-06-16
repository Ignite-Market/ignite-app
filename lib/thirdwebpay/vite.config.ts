import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      formats: ['es'],
      fileName: 'thirdwebpay',
      name: 'ThirdwebPay',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'thirdweb/react', 'thirdweb'],
    },
  },
});
