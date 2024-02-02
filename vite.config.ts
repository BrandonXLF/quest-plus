import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				content: 'src/main.tsx',
				inject: 'src/inject.ts'
			},
			output: {
				dir: 'assets',
				entryFileNames: '[name].js',
				assetFileNames: '[name].css'
			}
		}
	}
});
