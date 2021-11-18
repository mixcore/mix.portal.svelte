import path from 'path';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    ssr: false,
    vite: {
      resolve: {
        alias: {
          "@mix.core/shared": path.resolve('../../libs/shared/src')
        }
      }
    }
  }
};

export default config;
