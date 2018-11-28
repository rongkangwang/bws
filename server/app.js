const express = require('express');
const compress = require('compression');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./route');

const PORT = 3001;
const app = express();
app.use(cors());
app.use(compress());
app.use(timeout('15s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
route(app);
app.listen(PORT, function(){
    // if(process.env.npm_config_service_discovery) {
    //     sd.serviceDiscovery();
    // }
    console.log("Server listening on "+PORT);
});