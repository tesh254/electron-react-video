/* eslint-disable @typescript-eslint/no-empty-function */
import { app, protocol } from 'electron';
import './security-restrictions';
import { restoreOrCreateWindow } from './mainWindow';

const isDev: boolean = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false;

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
    app.quit();
    process.exit(0);
}

app.on('second-instance', restoreOrCreateWindow);

// app.disableHardwareAcceleration();

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', restoreOrCreateWindow);

app.whenReady()
    .then(() => {
        restoreOrCreateWindow();
        protocol.registerSchemesAsPrivileged([{
            scheme: 'https',
            privileges: {
                standard: true,
                secure: true,
            },
        }]);
    })
    .catch(e => console.error('Failed to create window: ', e));

if (isDev) {
    app.whenReady()
        .then(() => { })
        .catch(e => console.error('Failed install extension:', e));
}

if (!isDev) {
    app.whenReady()
        .then(() => import('electron-updater'))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => console.error('Failed check updates:', e));
}