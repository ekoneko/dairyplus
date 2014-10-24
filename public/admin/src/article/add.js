(function () {
    'use strict';

    window.app.controller('article-add-controller', function ($scope, $http) {
        console.log($scope);
        $scope.data = {type: 'markdown'};
        $scope.submit = function () {
            if ($scope.data.date) {
                $scope.data.date = new Date($scope.data.date).toString();
            }
            $http.post('/article/add', $scope.data).success(function () {
                $scope.data = {type: 'markdown'};
            });
        };
    });
}());