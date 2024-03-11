import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
   const envFile = mode === 'development' ? '.env.development' : '.env.production';
   dotenv.config({ path: envFile });

   return {
      plugins: [
         react(),
         jsconfigPaths()
      ],
      server: {
         proxy: {
            '/api/': {
               target: 'http://localhost:3000',
               rewrite: path => path.replace(/^\/api/, '')
            }
         }
      },
      build: {
         outDir: 'build',
         assetsDir: 'assets',
         emptyOutDir: true,
      },
      resolve: {
         alias: {
            '@': path.resolve(__dirname, './src'),
         }
      }
   }
});