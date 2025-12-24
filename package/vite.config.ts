import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
                form: path.resolve(__dirname, 'src/form/index.ts'),
                formulas: path.resolve(__dirname, 'src/formulas/index.ts'),
                models: path.resolve(__dirname, 'src/models/index.ts'),
                settings: path.resolve(__dirname, 'src/settings/index.ts'),
            },
            formats: ['es'],
            fileName: (format, entryName) => {
                if (entryName === 'index') {
                    return 'index.js';
                }
                return `${entryName}/index.js`;
            },
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@beyond-js/reactive', 'mathjs'],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: ({ name }) => {
                    if (name === 'index') {
                        return 'index.js';
                    }
                    return '[name]/index.js';
                },
                assetFileNames: 'assets/[name][extname]',
            },
        },
        sourcemap: true,
        outDir: 'dist',
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            '@bgroup/wise-form/models': path.resolve(__dirname, 'src/models'),
            '@bgroup/wise-form/formulas': path.resolve(
                __dirname,
                'src/formulas'
            ),
            '@bgroup/wise-form/form': path.resolve(__dirname, 'src/form'),
            '@bgroup/wise-form/settings': path.resolve(
                __dirname,
                'src/settings'
            ),
        },
    },
});
