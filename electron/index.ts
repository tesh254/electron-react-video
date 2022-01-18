import { app, BrowserWindow } from "electron";
import path from "path";

// enable debugging during development env
import isDev from "electron-is-dev";
// helps handling SPA routing in electron
import serve from "electron-serve";

// events declared
import './ipcMain';

// specify where out react javascript bundle lives
const loadURL = serve({ directory: "dist/parcel-build" })

const createWindow = async (): Promise<void> => {
    // create app window
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.js")
        }
    })

    if (isDev) {
        // if dev environment, load the localhost url hosting our react code
        await mainWindow.loadURL("http://localhost:1234");
        // open dev tools in a separate window
        mainWindow.webContents.openDevTools({ mode: "detach" });
    } else {
        await loadURL(mainWindow);
    }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})

app.on("activate", () => {
    // confirm no open window when clicking on the dock icon
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})