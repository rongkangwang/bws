const consul = require("consul")()
const fs = require("fs")
const config = 'config/config.json';

exports.serviceDiscovery = () => {
    let SERVER = JSON.parse(fs.readFileSync(config,'utf-8'));
    const SERVER_BKP = SERVER;
    consul.catalog.service.list(function(err, result) {
        if (err) throw err;
        for (const key in result){
            if(key !== "consul"){
                if(!SERVER[key]){
                    SERVER[key] = "";
                }
            }
        }
        if(SERVER !== SERVER_BKP){
            fs.writeFileSync(config, json);
        }
    });
    const watchers = [];
    for(let key in SERVER){
        // console.log(key);
        const watcher = consul.watch({
            method: consul.health.service,
            options: {
                service: key,
                passing: true
            }
        });
        watchers.push(watcher);
    }
    for(let i = 0; i < watchers.length; i++){
        watchers[i].on('change', (data, res) => {
            // console.log(data);
            // console.log(res);
            if(data.length > 0){
                const ip = "http://" + data[0].Service.Address + ":" + data[0].Service.Port;
                if(SERVER[data[0].Service.Service] !== ip) {
                    SERVER[data[0].Service.Service] = ip;
                    var json = JSON.stringify(SERVER);
                    fs.writeFileSync(config, json);
                }
            } else {
                if(SERVER[watchers[i]._options.service] !== ""){
                    SERVER[watchers[i]._options.service] = "";
                    var json = JSON.stringify(SERVER);
                    fs.writeFileSync(config, json);
                }
            }
        });
    }
}