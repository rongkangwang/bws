const forever = require('forever');
forever.list(true,function (err, processes) {
    if(processes){
        //console.log(processes);
        forever.stopAll(true);
    }
});
forever.startDaemon("app.js");

// const child = new (forever.Monitor)('app.js',{
//     'logFile': 'log',
//     'outFile': 'out',
//     'errFile': 'err',
// });
//
// child.on('exit', function () {
//     console.log('your-filename.js has exited after 3 restarts');
// });
//
// child.startDaemon();