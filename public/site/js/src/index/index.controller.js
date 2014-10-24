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