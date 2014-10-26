(function () {
    'use strict';
    
    window.app.directive('article', [function () {
        return {
            restrict: 'A',
            replace: false,
            templateUrl: 'template/block/article.directive.html',
            scope: {
                article: '='
            },
            link: function (scope, element, attributes) {
                var articleTag = element.find('article');
                scope.showMore = false;
                scope.hasMore = false;
                scope.$watch('article.content', function (newData, oldData) {
                    if (newData) {
                        if (articleTag.height() > 300) {
                            scope.hasMore = true;
                            articleTag.find('p').slice(4).addClass('more');
                        }
                    }
                });
            }
        };
    }]);
}());