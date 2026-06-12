const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("noklerElectron", {
  showOrderNotification: (order) => {
    ipcRenderer.send("show-order-notification", order);
  }
});