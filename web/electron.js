const electron = require('electron');
const child_process = require('child_process');
const path = require('path');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => {
    if (process.platform !== 'win32') app.quit();
});

app.on('ready', () => {
    const server_path = path.resolve(__dirname+'/../server');
    new Promise((resolve, reject) => {
        child_process.exec("cd "+server_path+" && npm run restart");
        setTimeout(resolve, 3000, 'Hello World!');
    }).then(()=>{
        mainWindow = new BrowserWindow();
        mainWindow.maximize();

        mainWindow.loadURL(`file://${__dirname}/index.html`);

        //mainWindow.webContents.openDevTools();

        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    });
})
