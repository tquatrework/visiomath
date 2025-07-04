import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';


export default defineConfig(({ mode }) => ({
    test: {
        name: 'unit',
        include: ['src/**/*.spec.ts'],
        globals: true,
    },
    plugins: [
        swc.vite(),
    ],
}));