const electron = require('electron');
const child_process = require('child_process');
const path = require('path');
const execa = require('execa');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;
app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', () => {
    // runExec().then(()=>{
    //     mainWindow = new BrowserWindow();
    //     mainWindow.maximize();

    //     mainWindow.loadURL(`file://${__dirname}/index.html`);

    //     //mainWindow.webContents.openDevTools();

    //     mainWindow.on('closed', () => {
    //         mainWindow = null;
    //     });
    // });

    runExec().then(()=>{
        new Promise((resolve, reject) => {
            setTimeout(resolve, 2000, 'Hello World!');  //delay 1 min
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

    // mainWindow = new BrowserWindow();
    // mainWindow.maximize();
    //
    // mainWindow.loadURL(`file://${__dirname}/index.html`);
    //
    // //mainWindow.webContents.openDevTools();
    //
    // mainWindow.on('closed', () => {
    //     mainWindow = null;
    // });

    // new Promise((resolve, reject) => {
    //     runExec();
    //     setTimeout(resolve, 3000, 'Hello World!');
    // }).then(()=>{
    //     mainWindow = new BrowserWindow();
    //     mainWindow.maximize();

    //     mainWindow.loadURL(`file://${__dirname}/index.html`);

    //     //mainWindow.webContents.openDevTools();

    //     mainWindow.on('closed', () => {
    //         mainWindow = null;
    //     });
    // });
});

function runExec(){
    //mac
    // fixPath();
    // const batpath = path.join(__dirname, '..', 'app.asar.unpacked', "start.bat");
    // // execa.shell(batpath);
    // //uppackdir
    // //const serverpath = path.join(__dirname, '..', 'app.asar.unpacked', "server");
    // //local
    // const serverpath = path.join(__dirname, '..', '..','..','..','..','..','..', "server");
    // execa.shell(batpath + " " + serverpath);

    //windows
    const batpath = path.join(__dirname, '..', 'app.asar.unpacked', "start.bat");
    const serverpath = path.join(__dirname, '..', '..','..','..','..', "server");
    return execa.shell(batpath + " " + serverpath);


    //execa("D:\\workspace\\bws\\web\\start.bat");  works for windows
    //child_process.exec("cd /d D:\workspace\bws\server && npm run restart");
    //child_process.spawn('cmd.exe',['/c D:\workspace\bws\web\start.bat']);
    //child_process.spawn("cd /d D:\workspace\bws\server && mkdir test && npm run restart");
    //child_process.exec('cmd.exe', '/c "cd /d D:\workspace\bws\server && mkdir test && npm run restart"')
}
