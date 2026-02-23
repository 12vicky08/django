const { contextBridge } = require('electron');

// Expose a minimal, secure API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
