module.exports = function (callback) {
    'use strict';

    // load base lib
    var path = require('path'),
        express = require('express'),
        when = require('when'),
        fs = require('fs'),
        _ = require('underscore'),
        app = express(),
        controller = require('./lib/controller.js'),

        initConfig = function () {
            var deferred = when.defer();
            fs.readFile(path.join(__dirname, '../configs/bower.json'), function(err, data) {
                if (err) {
                    return deferred.reject(err);
                }
                fs.writeFile(path.join(__dirname, '..', 'public/site/js/config.js'), data, function (err) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },

        initExpress = function () {
            var deferred = when.defer();
            app.set('env', process.env.NODE_ENV);
            app.use(express.favicon());
            app.use(express.logger('dev'));
            app.use(express.bodyParser());
            app.use(express.cookieParser(require('../configs/common.json').secret));
            app.use(express.methodOverride());
            app.use(express.limit('2mb'));
            app.use(require('connect-assets')({
                src: ["../public/js"]
            }));
            app.use(app.router);
            app.use(express["static"]('./public'));
            process.nextTick(deferred.resolve);
            return deferred.promise;
        },

        initTemplate = function () {
            var template = require('./lib/template.js'),
                deferred = when.defer();
            
            template.init(app);
            process.nextTick(deferred.resolve);
            return deferred.promise;
        },

        initRouter = function () {
            var setRoute, deferred,
                router = require('../configs/router.json');
            setRoute = function (method, key, value) {
                app[method](key, function (req, res, next) {
                    var params = value.split('/'),
                        c = controller.load(params[0], req, res, next);
                    if (!c) {
                        return next();
                    }
                    if (params[1] !== '*') {
                        return c.execAction(params[1], method);
                    }
                    c.execAction(req.params[0] || 'index', method);
                });
            };
            deferred = when.defer();
            _.each(['get', 'post'], function (method) {
                _.map(router[method], function (value, key) {
                    setRoute(method, key, value);
                });
            });
            app.all('/', function (req, res) {
                res.send(404);
            });
            process.nextTick(deferred.resolve);
            return deferred.promise;
        };

    initConfig()
        .then(initExpress)
        .then(initRouter)
        .then(initTemplate)
        .then(function () {
            callback(app);
        })
        .otherwise(function (err) {
            console.error(err);
        });
};