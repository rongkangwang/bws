const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname,"..","sqlite","bws-sqlite.db"));
db.run("pragma journal_mode = WAL");
exports.getUserTypes = function(req, res) {
    db.all("select * from usertype",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addUserType = function(req, res) {
    const usertype = req.body;
    const insertString = "null,'"+usertype.type+"'";
    db.run('INSERT INTO usertype values ('+insertString+')',function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.removeUserType = function(req, res) {
    const {id} = req.params;
    db.run('DELETE FROM usertype WHERE id = '+id,function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.getUsers = function(req, res) {
    db.all("select * from user",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addUser = function(req, res) {
    const user = req.body;
    const insertString = "null,'"+user.username+"',"+(user.address===undefined?null:"'"+user.address+"'")+",'"+user.device_id+"',"+(user.device_phone===undefined?null:"'"+user.device_phone+"'")+","+user.usertype_id;
    db.all('select * from user where device_id="'+user.device_id+'"', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            if(results.length>0){
                res.send({errno:11111, sqlMessage:"设备号冲突！"});
            }else{
                db.run('INSERT INTO user values ('+insertString+')', function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        console.log(results);
                        res.send(results);
                    }
                });
            }
        }
    });
};
exports.removeUser = function(req, res) {
    const {id} = req.params;
    db.run('DELETE FROM user WHERE id = '+id, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.updateUser = function(req, res) {
    const updateset = req.body;
    const {id} = req.params;
    if("device_id" in updateset){
        db.all('select * from user where device_id="'+updateset.device_id+'"', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(results);
                if(results.length>0){
                    res.send({errno:11111, sqlMessage:"设备号冲突！"});
                }else{
                    let updateString = '';
                    for(let key in updateset){
                        if(updateset[key]!==undefined){
                            updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
                        }
                    }
                    updateString = updateString.substr(0,updateString.length-1);
                    db.run('Update user set '+updateString+' WHERE id = ' + id, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            res.send(error);
                        } else {
                            console.log(results);
                            res.send(results);
                        }
                    });
                }
            }
        });
    }else {
        let updateString = '';
        for(let key in updateset){
            if(updateset[key]!==undefined){
                updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
            }
        }
        updateString = updateString.substr(0,updateString.length-1);
        db.run('Update user set '+updateString+' WHERE id=' + id, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(results);
                res.send(results);
            }
        });
    }
};
exports.getEvents = function(req, res) {
    db.all("select event.*, user.username, user.device_id from event join user on user.id=event.user_id order by datetime desc",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addEvent = function(req, res) {
    const event = req.body;
    const insertString = "null,'"+event.datetime+"','"+event.detector_type+"','"+event.position+"',"+(event.solution===undefined?null:"'"+event.solution+"'")+","+event.user_id;
    db.run('INSERT INTO event values ('+insertString+')', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.removeEvent = function(req, res) {
    console.log("wang");
    const {eventid} = req.params;
    console.log(eventid);
    db.run('DELETE FROM event WHERE id = '+eventid, function (error, results, fields) {
        if (error) {
            console.log("error");
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.updateEvent = function(req, res) {
    const updateset = req.body;
    const {eventid} = req.params;
    let updateString = '';
    for(let key in updateset){
        if(updateset[key]!==undefined){
            updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
        }
    }
    updateString = updateString.substr(0,updateString.length-1);
    db.run('Update event set '+updateString+' WHERE id = '+eventid,function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.getDevices = function(req, res) {
    db.all("select deviceselfcheck.*, user.username, user.device_id from deviceselfcheck join user on user.id=deviceselfcheck.user_id order by date desc",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addDevice = function(req, res) {
    const deviceselfcheck = req.body;
    const insertString = "null,'"+deviceselfcheck.date+"','"+deviceselfcheck.status+"',"+(deviceselfcheck.solution===undefined?null:"'"+deviceselfcheck.solution+"'")+","+deviceselfcheck.user_id;
    db.run('INSERT INTO deviceselfcheck values ('+insertString+')', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.removeDevice = function(req, res) {
    const {deviceselfcheckid} = req.params;
    db.run('DELETE FROM deviceselfcheck WHERE id = "'+deviceselfcheckid+'"', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.updateDevice = function(req, res) {
    const updateset = req.body;
    const {deviceselfcheckid} = req.params;
    let updateString = '';
    for(let key in updateset){
        if(updateset[key]!==undefined){
            updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
        }
    }
    updateString = updateString.substr(0,updateString.length-1);
    db.run('Update deviceselfcheck set '+updateString+' WHERE id = '+deviceselfcheckid,function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.getRepairs = function(req, res) {
    db.all("select repair.*, user.username, user.device_id from repair join user on user.id=repair.user_id order by date desc",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addRepair = function(req, res) {
    const repair = req.body;
    const insertString = "null,'"+repair.date+"','"+repair.status+"','"+repair.content+"','"+repair.material+"','"+repair.staff+"',"+repair.user_id;
    db.run('INSERT INTO repair values ('+insertString+')', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.removeRepair = function(req, res) {
    const {repairid} = req.params;
    db.run('DELETE FROM repair WHERE id = "'+repairid+'"', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.updateRepair = function(req, res) {
    const updateset = req.body;
    const {repairid} = req.params;
    let updateString = '';
    for(let key in updateset){
        if(updateset[key]!==undefined){
            updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
        }
    }
    updateString = updateString.substr(0,updateString.length-1);
    db.run('Update repair set '+updateString+' WHERE id = '+repairid,function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.getTests = function(req, res) {
    db.all("select test.*, user.username, user.device_id from test join user on user.id=test.user_id order by datetime desc",function (error, results) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.addTest = function(req, res) {
    const test = req.body;
    const insertString = "null,'"+test.datetime+"','"+test.test_type+"','"+test.sector+"','"+test.position+"',"+test.report_num+",'"+test.phone_number+"',"+test.user_id;
    db.run('INSERT INTO test values ('+insertString+')', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.removeTest = function(req, res) {
    const {testid} = req.params;
    db.run('DELETE FROM test WHERE id = "'+testid+'"', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};
exports.updateTest = function(req, res) {
    const updateset = req.body;
    const {testid} = req.params;
    let updateString = '';
    for(let key in updateset){
        if(updateset[key]!==undefined){
            updateString += (updateset[key]===undefined?'':key+'="'+updateset[key]+'",');
        }
    }
    updateString = updateString.substr(0,updateString.length-1);
    db.run('Update test set '+updateString+' WHERE id = '+testid,function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};