const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'win32') app.quit();
});

app.on('ready', () => {
    mainWindow = new BrowserWindow();
    mainWindow.maximize();

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
})