angular.module('githubNotifierApp')
.controller('LoginCtrl', function LoginCtrl ($scope, $location, GithubService) {
  $scope.login = function () {
    GithubService.connect();
  };
});
