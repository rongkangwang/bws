const electron = require('electron');
const child_process = require('child_process');
const path = require('path');
const execa = require('execa');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
app.on('window-all-closed', () => {
    if (process.platform !== 'win32') app.quit();
});

app.on('ready', () => {
    new Promise((resolve, reject) => {
        runExec();
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
});

function runExec(){
    const batpath = path.join(__dirname, "start.bat");
    execa(batpath);
    //execa("D:\\workspace\\bws\\web\\start.bat");
    //child_process.exec("cd /d D:\workspace\bws\server && npm run restart");
    //child_process.spawn('cmd.exe',['/c D:\workspace\bws\web\start.bat']);
    //child_process.spawn("cd /d D:\workspace\bws\server && mkdir test && npm run restart");
    //child_process.exec('cmd.exe', '/c "cd /d D:\workspace\bws\server && mkdir test && npm run restart"')
}
