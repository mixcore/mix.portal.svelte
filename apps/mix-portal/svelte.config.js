import path from 'path';
import preprocess from 'svelte-preprocess';
import { optimizeImports } from "carbon-preprocess-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [preprocess(), optimizeImports()],
    kit: {
        vite: {
            endpointExtensions: ['.js', '.ts'],
            files: {
                hooks: 'src/hook.js',
            },
            resolve: {
                alias: {
                    "@mix.core/shared": path.resolve('../../libs/shared/src'),
                    "@mix.core/mix.lib": path.resolve('../../libs/mix.lib/src')
                }
            }
        }
    }
};

export default config;