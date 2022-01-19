import { BrowserWindow } from 'electron';
import * as path from 'path';
import { URL } from 'url';

// enable debugging during development env
// import isDev from "electron-is-dev";
// helps handling SPA routing in electron
import * as serve from 'electron-serve';

// events declared
// import './ipcMain';

// specify where out react javascript bundle lives
const loadURL = serve({ directory: 'packages/renderer/dist' });

const isDev: boolean = process.env.APP_DEV ? (process.env.APP_DEV.trim() == 'true') : false;

const createWindow = async (): Promise<BrowserWindow> => {
    // create app window
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: path.resolve(__dirname, '../../preload/dist/index.js'),
            nativeWindowOpen: true,
            webviewTag: false,
        },
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();

        if (isDev) {
            mainWindow?.webContents.openDevTools();
        }
    });

    const pageUrl = isDev ? 'http://localhost:1234'
        : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    await mainWindow.loadURL(pageUrl);
    if (isDev) {
        // if dev environment, load the localhost url hosting our react code
        await mainWindow.loadURL('http://localhost:1234');
        // open dev tools in a separate window
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {
        await loadURL(mainWindow);
    }

    return mainWindow;
};

export async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (window === undefined) {
        window = await createWindow();
    }

    if (window.isMinimized()) {
        window.restore();
    }

    window.focus();
}