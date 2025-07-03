import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            // à créer pour les tests unitaires
            //'./vitest.config.unit.ts',
            './vitest.config.e2e.ts',
        ],
    },
})
