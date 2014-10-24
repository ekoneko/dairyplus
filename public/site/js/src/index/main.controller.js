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