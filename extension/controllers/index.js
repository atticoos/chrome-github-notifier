angular.module('githubNotifierApp')
.controller('IndexCtrl', function ($location, token) {
  if (token) {
    $location.path('/repos');
  } else {
    $location.path('/login');
  }

})
