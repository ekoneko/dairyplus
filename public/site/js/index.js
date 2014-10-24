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
(function () {
    app.controller('index-controller', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
        var yearIndex, monthIndex, getPrevDate, getNextDate;

        yearIndex = monthIndex = 0;
        /**
         * get time map
         */
        $http.get('/data/index/time.json').success(function (res) {
            $scope.timeMap = res;
        }).success(function () {
            var year, month;
            if ($scope.timeMap.length) {
                if ($scope.initDate) {
                    year = $scope.initDate.split('-');
                    month = +year[1];
                    year = +year[0];
                    for (var i in $scope.timeMap) {
                        if ($scope.timeMap[i].year === year) {
                            break;
                        }
                        yearIndex += 1;
                    }
                    monthIndex = $scope.timeMap[yearIndex].month.indexOf(month);
                    $scope.currentDate = $scope.initDate
                } else {
                    $scope.currentDate = $filter('dateformat')($scope.timeMap[yearIndex].year + '/' + $scope.timeMap[yearIndex].month[monthIndex] + '/1', 'yyyy-MM');
                }
            }
        });

        $scope.$watch('currentDate', function () {
            if (!$scope.currentDate) {
                return;
            }
            $http.get('/data/content/' + $scope.currentDate + '.json').success(function (res) {
                $scope.datas = res;
            });
            $scope.prevDate = getPrevDate();
            $scope.nextDate = getNextDate();
        });
        $scope.$watch('initDate',function () {
            var year, month;
            if (!$scope.currentDate) {
                return;
            }
            year = $scope.initDate.split('-');
            month = +year[1];
            year = +year[0];
            for (var i in $scope.timeMap) {
                if ($scope.timeMap[i].year === year) {
                    break;
                }
                yearIndex += 1;
            }
            monthIndex = $scope.timeMap[yearIndex].month.indexOf(month);
            $scope.currentDate = $scope.initDate;
        });

        getPrevDate = function () {
            var current = $scope.timeMap[yearIndex];
            if (current.month[monthIndex + 1]) {
                return [$scope.timeMap[yearIndex].year, $scope.timeMap[yearIndex].month[monthIndex + 1]];
            } else if ($scope.timeMap[yearIndex + 1]) {
                return [$scope.timeMap[yearIndex + 1].year, $scope.timeMap[yearIndex + 1].month[0]];
            } else {
                return null;
            }
        }

        getNextDate = function () {
            var currentYear = $scope.timeMap[yearIndex].year;
            if (monthIndex > 0) {
                return [$scope.timeMap[yearIndex].year, $scope.timeMap[yearIndex].month[monthIndex - 1]];
            } else if ($scope.timeMap[yearIndex - 1]) {
                return [$scope.timeMap[yearIndex - 1].year, $scope.timeMap[yearIndex - 1].month[$scope.timeMap[yearIndex - 1].month.length -1]];
            } else {
                return null;
            }
        }
    }]);
}());
(function () {
    app.controller('main-controller', ['$scope', '$http', function ($scope, $http) {
        /**
         * get global config
         */
        $http.get('/js/config.js').success(function (res) {
            $scope.siteConfig = res;
        });

        /**
         * get type map
         */
        $http.get('/data/index/type.json').success(function (res) {
            $scope.typeMap = res;
        });

        /**
         * get tag map
         */
        $http.get('/data/index/tag.json').success(function (res) {
            $scope.tageMap = res;
        });
    }]);
}());
(function () {
    app.controller('tag-controller', ['$scope', '$http', function ($scope, $http) {
        $scope.$watch('tag', function () {
            if (!$scope.tag) {
                return;
            }
            $http.get('/data/tags/' + $scope.tag + '.json').success(function (res) {
                $scope.datas = res;
            });
        });
    }]);
}());