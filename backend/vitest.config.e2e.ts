import swc from 'unplugin-swc';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
    test: {
        include: ['src/**/*.e2e-spec.ts'],
        globals: true,
        //nodeArgs: ['--loader', 'ts-node/esm'],
    },
    plugins: [swc.vite()],
}));