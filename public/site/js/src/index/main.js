(function () {
    'use strict';
    
    window.app = angular.module('dairyplus-app', ['ngRoute', 'ngAnimate']);

    window.app.config(function ($routeProvider) {
        $routeProvider
            .when('/tag/:tag', {
                templateUrl: function () {
                    return '/template/tag.html';
                },
                resolve: {
                    load: function ($route, $rootScope) {
                        if ($route.current.params.tag) {
                            $rootScope.tag = $route.current.params.tag;
                        }
                    }
                }
            })
            .when('/:date?', {
                templateUrl: function (params) {
                    if (params.date && !params.date.match(/\d{4}\-\d{1,2}/)) {
                        return '/template/404.html';
                    }
                    return '/template/index.html';
                },
                resolve: {
                    load: function ($route, $rootScope) {
                        if ($route.current.params.date && $route.current.params.date.match(/\d{4}\-\d{1,2}/)) {
                            $rootScope.initDate = $route.current.params.date;
                        }
                    }
                }
            })
            .otherwise({
                templateUrl: function () {
                    return '/template/404.html';
                }
            });
    });

    window.app.filter('split', function () {
        return function(input, flag) {
            var flag = flag || ',';
            if (typeof input !== 'string') {
                return '';
            }
            return input.split(flag);
        };
    })
    .filter('dateformat', ['$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        }
    }])
    .filter('textformat', [function () {
        return function (input, type) {
            switch (type) {
                case 'markdown':
                    return marked(input);
                default:
                    return input;
            }
        }
    }]);
}());