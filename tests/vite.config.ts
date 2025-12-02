import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	server: {
		port: 2300,
	},
	resolve: {
		alias: [
			{
				find: '@bgroup/wise-form/form',
				replacement: path.resolve(__dirname, '../package/src/form'),
			},
			{
				find: '@bgroup/wise-form/models',
				replacement: path.resolve(__dirname, '../package/src/models'),
			},
			{
				find: '@bgroup/wise-form/formulas',
				replacement: path.resolve(__dirname, '../package/src/formulas'),
			},
			{
				find: '@bgroup/wise-form/settings',
				replacement: path.resolve(__dirname, '../package/src/settings'),
			},
			{
				find: '@bgroup/wise-form',
				replacement: path.resolve(__dirname, '../package/src'),
			},
		],
	},
});

