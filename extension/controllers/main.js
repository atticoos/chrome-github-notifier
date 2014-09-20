angular.module('githubNotifierApp')
.controller('MainCtrl', function ($scope, $location) {
  $scope.navigateTo = function (path) {
    console.log('wtf', path);
    $location.path(path);
  }
});
