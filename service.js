(function () {
    'use strict';

    var diybb = require('./core/dairyplus.js'),
        http = require('http'),
        port = require('./configs/admin.json').port;

    diybb(function (app) {
        http.createServer(app).listen(port, function () {
            console.log('Express server listening on port ' + port);
        });
    });
}());