angular.module('githubNotifierApp')
.controller('MainCtrl', function ($scope, $location, $window) {
  $scope.navigateTo = function (path) {
    $location.path(path);
  };

  $scope.logout = function () {
    $window.chrome.storage.local.clear();
    $location.path('/');
    console.log('logout');
  }
});
