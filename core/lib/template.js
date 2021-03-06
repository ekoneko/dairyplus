/**
 * template
 */
(function () {
    'use strict';
    
    this.init = function (app) {
        var hbs = require('express-hbs'),
            fs = require('fs'),
            path = require('path'),
            md5 = require('MD5'),
            _ = require('underscore'),
            express = require('express');
        require('child_process').exec('rm -Rf ../public/javascripts/cache/*');
        app.engine('hbs', hbs.express3({
            partialsDir: path.join(__dirname + '/../views'),
            contentHelperName: 'content'
        }));
        app.set('view engine', 'hbs');
        app.set('views', __dirname + '/../views');

        // hbs helper
        hbs.registerHelper('braces', function (string) {
            return '{{' + string + '}}';
        });

        hbs.registerHelper('for', function (from, to, incr, block) {
            var accum = '', i;
            for (i = from; i < to; i += incr) {
                accum += block.fn(i);
            }
            return accum;
        });

        hbs.registerAsyncHelper('script', function (block, callback) {
            var version,
                src,
                tags = block.fn(),
                cacheName,
                data = '';
            if ('product' !== process.env.NODE_ENV) {
                return callback(tags);
            }
            tags = tags.replace(/<!--(.*?)-->/g, '');
            cacheName = '/javascripts/cache/' + md5(tags) + '.js';
            fs.exists(path.join(__dirname, '..', '..', 'public', cacheName), function (exists) {
                version = require('../../configs/common.json').version;
                if (!exists) {
                    _.each(tags.match(/<script[^>]*\ssrc="[^"]+"/g), function (tag) {
                        src = tag.match(/\ssrc="(.+)"/)[1];
                        data += fs.readFileSync(path.join(__dirname, '../../public', src));
                        data += ';';
                    });
                    fs.writeFile(path.join(__dirname, '../../public', cacheName), data, function () {
                        callback('<script src="' + cacheName + '?' + version + '"></script>');
                    });
                } else {
                    callback('<script src="' + cacheName + '?' + version + '"></script>');
                }
            });
        });

    };
}.call(this));