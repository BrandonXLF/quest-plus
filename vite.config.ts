import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				dir: 'assets',
				entryFileNames: 'content.js',
				assetFileNames: 'content.css',
				manualChunks: undefined
			}
		}
	}
});
