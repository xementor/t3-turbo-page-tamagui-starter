// Importing env files here to validate on build
// import "./src/env.mjs";
// import "@acme/auth/env.mjs";

// /** @type {import("next").NextConfig} */
// const config = {
//   reactStrictMode: true,
//   /** Enables hot reloading for local packages without a build step */
//   transpilePackages: ["@acme/api", "@acme/auth", "@acme/db"],
//   /** We already do linting and typechecking as separate tasks in CI */
//   eslint: { ignoreDuringBuilds: true },
//   typescript: { ignoreBuildErrors: true },
// };

// export default config;

// Importing env files here to validate on build
// require("./src/env.mjs");
// require("@acme/auth/env.mjs");
import("./src/env.mjs").catch(err => console.error(err));
import("@acme/auth/env.mjs").catch(err => console.error(err));

/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('path')

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

console.log(`
Welcome to Tamagui!
`)

const plugins = [
  withTamagui({
    config: '../../packages/config/tamagui/src/tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
]

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    typescript: {
      ignoreBuildErrors: true,
    },
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
        skipDefaultConversion: true,
      },
    },
    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
      "@acme/api", "@acme/auth", "@acme/db"
    ],
    experimental: {
      scrollRestoration: true,
    },
  }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}

