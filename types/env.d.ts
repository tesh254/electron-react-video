
interface ImportMetaEnv {

    /**
     * The value of the variable is set in scripts/watch.js and depend on packages/main/vite.config.js
     */
    readonly REACT_DEV_SERVER_URL: undefined | string;
    readonly DEV: undefined | boolean;
    readonly PROD: undefined | boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
