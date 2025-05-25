// eslint.config.js
const { ESLint } = require("eslint");

module.exports = [
  {
    files: ["*.js", "*.ts"],
    languageOptions: {
      parser: "@typescript-eslint/parser", // Utiliser le parser TypeScript
      parserOptions: {
        ecmaVersion: 2020, // Support des fonctionnalités modernes de JS
        sourceType: "script", // CommonJS par défaut
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"), // Charger le plugin TypeScript
    },
    rules: {
      "no-unused-vars": "warn", // Prévenir les variables inutilisées
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn", // Prévenir l'usage de 'any'
      "no-console": "off", // Autoriser l'usage de console.log
    },
  },
  {
    files: ["*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Désactiver TypeScript pour les fichiers JS simples
    },
  },
];