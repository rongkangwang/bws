const Table = require('./Controller/Table')
const PDF = require('./Controller/NewPDF')
const UserTypePDF = require('./Controller/UserTypePDF')

module.exports = function(app){
    app.get('/', function (req, res) {
        res.send("Hello World");
    });

    app.get('/usertypes', Table.getUserTypes);
    app.put('/usertype', Table.addUserType);
    app.delete('/usertype/:id', Table.removeUserType);
    app.get('/users', Table.getUsers);
    app.put('/user', Table.addUser);
    app.delete('/user/:id', Table.removeUser);
    app.post('/user/:id', Table.updateUser);

    app.get('/events', Table.getEvents);
    app.put('/event', Table.addEvent);
    app.delete('/event/:eventid', Table.removeEvent);
    app.post('/event/:eventid', Table.updateEvent);

    app.get('/devices', Table.getDevices);
    app.put('/device', Table.addDevice);
    app.delete('/device/:deviceselfcheckid', Table.removeDevice);
    app.post('/device/:deviceselfcheckid', Table.updateDevice);

    app.get('/repairs', Table.getRepairs);
    app.put('/repair', Table.addRepair);
    app.delete('/repair/:repairid', Table.removeRepair);
    app.post('/repair/:repairid', Table.updateRepair);

    app.get('/tests', Table.getTests);
    app.put('/test', Table.addTest);
    app.delete('/test/:testid', Table.removeTest);
    app.post('/test/:testid', Table.updateTest);
    //app.get('/user/user_id', Table.getUser);
    app.get('/pdf', PDF.generatepdf);
    app.get('/usertypepdf', UserTypePDF.generatepdf)
};