const Table = require('./Controller/Table')

module.exports = function(app){
    app.get('/', function (req, res) {
        res.send("Hello World");
    });
    app.get('/api/item', Table.getData);
    app.get('/api/items', Table.getDatas)
};