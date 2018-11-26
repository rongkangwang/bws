const request = require('request');
const lodash = require('lodash')
const file_system = require('file-system')
const fs = require('fs')

exports.getData = function(req, res) {
    const {endpoint, show_type, network_id, user_id, search_fields, search_params, subresource} = req.query;
    let {domain} = req.query;
    //console.log(req.query);
    // const search_fields = JSON.parse(req.query.search_fields);
    // const search_params = JSON.parse(req.query.search_params);
    if(process.env.npm_config_service_discovery) {
        const SERVER = JSON.parse(fs.readFileSync('config/config.json','utf-8'));
        if(!SERVER[domain]){
            // res.statusText = domain + ' is not available!';
            res.send({
                "errors": [
                    {
                        "message": domain + ' is not available!'
                    }
                ]
            });
        }
        domain = SERVER[domain];
    } else {
        if(!domain||domain==":"){
            res.send({
                "errors": [
                    {
                        "message": domain + ' is not available!'
                    }
                ]
            });
        }
    }
    let url = "http://";
    url += domain + "/" + endpoint;
    if(search_fields){
        url += "/" + search_fields;
    }
    if(subresource){
        url += "/" + subresource;
    }
    if(search_params || show_type){
        url += "?";
        if(search_params && show_type) {
            url += search_params + "&" + 'show=["' + show_type + '"]';
        }
        else if(show_type){
            url += 'show=["' + show_type + '"]';
        }
        else if(search_params) {
            url += search_params;
        }
    }
    console.log(url);
    const options = {
        url: url,
        headers: {
            "X-FreeWheel-Network-ID":network_id,
            "X-FreeWheel-User-ID":user_id
        }
    };
    request.get(options, function(error, response, body) {
        if(error) {
            console.log(error);
            res.send({
                "errors": [
                    {
                        "message": ' error occurs when request ' + domain + "!"
                    }
                ]
            });
        }
        if (response && !response.error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.send(body);
        }
    });
}
exports.getDatas = function(req, res) {
    const {domain, endpoint, network_id, user_id} = req.query;
    const url = SERVER[domain] + "/" + endpoint;
    console.log(url);
    const options = {
        url: url,
        headers: {
            "X-FreeWheel-Network-ID":network_id,
            "X-FreeWheel-User-ID":user_id
        }
    };
    request.get(options, function(error, response, body) {
        if(error) throw error;
        if (response.statusCode === 200 && !response.error) {
            res.send(body);
        }
    });
}