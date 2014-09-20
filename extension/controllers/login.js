angular.module('githubNotifierApp')
.controller('LoginCtrl', function LoginCtrl ($scope, $location, GithubService) {
  console.log('login ctrl');
  $scope.login = function () {
    GithubService.connect().then(function (response) {
      console.log('response', response);
      alert('response', response);
    });
  };
});
