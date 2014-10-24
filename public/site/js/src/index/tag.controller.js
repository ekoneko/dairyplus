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