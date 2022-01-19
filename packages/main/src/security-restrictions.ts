/* eslint-disable @typescript-eslint/ban-ts-comment */
import { app, shell } from 'electron';
import { URL } from 'url';
import isDev from 'electron-is-dev';

const ALLOWED_ORIGINS_AND_PERMISSIONS = new Map<string, Set<'clipboard-read' | 'media' | 'display-capture' | 'mediaKeySystem' | 'geolocation' | 'notifications' | 'midi' | 'midiSysex' | 'pointerLock' | 'fullscreen' | 'openExternal' | 'unknown'>>(
    // @ts-ignore
    isDev
        ? [[new URL('http://localhost:1234').origin, new Set]]
        : [],
);

const ALLOWED_EXTERNAL_ORIGINS = new Set<`https://${string}`>([
    'https://github.com',
]);

app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, url) => {
        const { origin } = new URL(url);

        if (ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {
            return;
        }

        event.preventDefault();

        if (isDev) {
            console.warn('Blocked navigating to an unallowed origin:', origin);
        }
    });

    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const { origin } = new URL(webContents.getURL());

        const permissionGranted = !!ALLOWED_ORIGINS_AND_PERMISSIONS.get(origin)?.has(permission);
        if (permission === 'media') {
            callback(true);
        } else {
            callback(permissionGranted);
        }

        if (!permissionGranted && isDev) {
            console.warn(`${origin} requested permission for '${permission}', but was blocked.`);
        }
    });

    contents.setWindowOpenHandler(({ url }) => {
        const { origin } = new URL(url);

        // @ts-expect-error Type checking is performed in runtime
        if (ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
            // Open default browser
            shell.openExternal(url).catch(console.error);

        } else if (isDev) {
            console.warn('Blocked the opening of an unallowed origin:', origin);
        }

        // Prevent creating new window in application
        return { action: 'deny' };
    });

    contents.on('will-attach-webview', (event, webPreferences, params) => {
        const { origin } = new URL(params.src);
        if (!ALLOWED_ORIGINS_AND_PERMISSIONS.has(origin)) {

            if (isDev) {
                console.warn(`A webview tried to attach ${params.src}, but was blocked.`);
            }

            event.preventDefault();
            return;
        }

        // Strip away preload scripts if unused or verify their location is legitimate
        delete webPreferences.preload;
        // @ts-expect-error `preloadURL` exists - see https://www.electronjs.org/docs/latest/api/web-contents#event-will-attach-webview
        delete webPreferences.preloadURL;

        // Disable Node.js integration
        webPreferences.nodeIntegration = false;
    });
});