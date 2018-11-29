const request = require('request');
const lodash = require('lodash')
const file_system = require('file-system')
const fs = require('fs')
const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'test',
    password : 'test',
    database : 'bws'
});
connection.connect();
exports.getUsers = function(req, res) {
    connection.query("select * from user",function (error, results) {
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
    connection.query('select * from user where device_id="'+user.device_id+'"', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            if(results.length>0){
                res.send({errno:11111, sqlMessage:"设备号冲突！"});
            }else{
                connection.query('INSERT INTO user SET ?', user, function (error, results, fields) {
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
    connection.query('DELETE FROM user WHERE id = '+id, function (error, results, fields) {
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
        connection.query('select * from user where device_id="'+updateset.device_id+'"', function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send(error);
            } else {
                console.log(results);
                if(results.length>0){
                    res.send({errno:11111, sqlMessage:"设备号冲突！"});
                }else{
                    connection.query('Update user set ? WHERE id = ' + id, updateset, function (error, results, fields) {
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
        connection.query('Update user set ? WHERE id = ' + id, updateset, function (error, results, fields) {
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
    connection.query("select * from event join user on user.id=event.user_id",function (error, results) {
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
    connection.query('INSERT INTO event SET ?', event, function (error, results, fields) {
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
    const {eventid} = req.params;
    connection.query('DELETE FROM event WHERE id = "'+eventid+'"', function (error, results, fields) {
        if (error) {
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
    connection.query('Update event set ? WHERE id = '+eventid, updateset,function (error, results, fields) {
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
    connection.query("select * from deviceselfcheck join user on user.id=deviceselfcheck.user_id",function (error, results) {
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
    connection.query('INSERT INTO deviceselfcheck SET ?', deviceselfcheck, function (error, results, fields) {
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
    connection.query('DELETE FROM deviceselfcheck WHERE id = "'+deviceselfcheckid+'"', function (error, results, fields) {
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
    connection.query('Update deviceselfcheck set ? WHERE id = '+deviceselfcheckid, updateset,function (error, results, fields) {
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
    connection.query("select * from repair join user on user.id=repair.user_id",function (error, results) {
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
    connection.query('INSERT INTO repair SET ?', repair, function (error, results, fields) {
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
    connection.query('DELETE FROM repair WHERE id = "'+repairid+'"', function (error, results, fields) {
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
    connection.query('Update repair set ? WHERE id = '+repairid, updateset,function (error, results, fields) {
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
    connection.query("select * from test join user on user.id=test.user_id",function (error, results) {
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
    connection.query('INSERT INTO test SET ?', test, function (error, results, fields) {
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
    connection.query('DELETE FROM test WHERE id = "'+testid+'"', function (error, results, fields) {
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
    connection.query('Update test set ? WHERE id = '+testid, updateset,function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(results);
            res.send(results);
        }
    });
};