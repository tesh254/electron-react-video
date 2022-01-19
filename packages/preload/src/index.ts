import { contextBridge } from 'electron';
import { sha256sum } from './sha256sum';

contextBridge.exposeInMainWorld('versions', process.versions);

contextBridge.exposeInMainWorld('nodeCrypto', {sha256sum});