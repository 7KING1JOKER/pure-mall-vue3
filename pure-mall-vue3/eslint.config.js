import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  { ignores: ["**/dist/**", "**/node_modules/**", "**/logs/**", "**/*.log", ".DS_Store"] },
  // 使用Vue插件提供的推荐配置
  ...pluginVue.configs["flat/recommended"],
  // Vue + TypeScript配置
  {
    files: ["**/*.vue"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parser: tsParser
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  // TypeScript文件配置
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  // 为页面组件添加例外规则
  {
    files: ["**/pages/**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
];