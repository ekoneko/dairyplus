(function () {
    'use strict';
    var connect = require('connect'),
        path = require('path');

    connect.createServer(
        connect.static(path.join(__dirname, 'public', 'site'))
    ).listen(require('./configs/common.json').port);
}());