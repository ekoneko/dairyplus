(function () {
    'use strict';

    window.app.config(function ($routeProvider) {
        $routeProvider.when('/:controller/:action', {
            templateUrl: function (params) {
                return '/admin/template/' + params.controller + '/' + params.action + '.html';
            }
        });
    });
}());