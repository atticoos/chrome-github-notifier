angular.module('githubNotifierApp')
.controller('IndexCtrl', function ($location, token) {
  console.log('index ctrl');
  if (token) {
    $location.path('/repos');
  } else {
    $location.path('/login');
  }

})
