import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("api", {
    // define methods to call events defined in ./ipcMain/index.ts
});