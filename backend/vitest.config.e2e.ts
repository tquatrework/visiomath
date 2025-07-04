import swc from 'unplugin-swc';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
    test: {
        globals: true,
        name: 'e2e',
        include: ['src/**/*.e2e-spec.ts'],
        setupFiles: ['./e2e-setup.ts'],
        nodeArgs: ['--loader', 'ts-node/esm'],
    },
    plugins: [swc.vite()],
}));