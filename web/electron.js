 const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

// app.on('window-all-closed', () => {
//     console.log(process.platform);
//     if (process.platform !== 'win32') app.quit();
// });

app.on('ready', () => {
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });

    mainWindow.loadURL("127.0.0.1:8082");

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
})