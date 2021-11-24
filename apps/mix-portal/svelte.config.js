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
                    "@mix.core/shared": path.resolve('../../libs/shared/src'),
                    "@mix.core/libs": path.resolve('../../libs/mix.lib.ts/src')
                }
            },
            ssr: {
                //noExternal: [/axios/g]
                external: ['@mix.core/libs']
            },
            optimizeDeps: {
                exclude: ['axios']
            },
            // esbuild: {
            //     exclude: ['axios']
            // }
        }
    }
};

export default config;