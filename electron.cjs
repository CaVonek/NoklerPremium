const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    title: "Nokler Premium",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, "dist", "index.html"));
}

ipcMain.on("show-order-notification", (event, order) => {
  if (Notification.isSupported()) {
    new Notification({
      title: "Nowe zamówienie Nokler",
      body: `Zamówienie #${order.id}\nKlient: ${order.customer?.name || "Brak danych"}`
    }).show();
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});