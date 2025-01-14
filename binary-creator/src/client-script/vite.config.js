import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/main.js'),
            name: 'mapRenderer',
            fileName: format => `map-renderer.${format}.js`,
            formats: ['umd']
        },
        outDir: '../html',
        emptyOutDir: true
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'src/map-renderer.html',
                    dest: '.'
                }
            ]
        })
    ]
});