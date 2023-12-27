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