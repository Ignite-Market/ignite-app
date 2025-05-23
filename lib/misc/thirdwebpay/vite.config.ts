import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
// import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // dts({
    //   tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
    //   include: ['src'],
    //   rollupTypes: true,
    // }),
  ],

  build: {
    outDir: 'build',
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      fileName: 'thirdwebpay',
      name: 'ThirdwebPay',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
