angular.module('githubNotifierApp')
.controller('ReposCtrl', ReposCtrl);
function ReposCtrl ($scope, $http, $window, GithubService, StorageService) {
  $scope.repos = [];

  GithubService.getRepositories().then(function (repos) {
    $scope.repos = repos;
    return GithubService.getSubscriptions();
  }).then(function (subs) {
    angular.forEach($scope.repos, function (repo) {
      if (subs.indexOf(repo.id) > -1) {
        repo.subscribed = true;
      } else {
        repo.subscribed = false;
      }
    });
  });

  $scope.sub = function (repo) {
    var index;
    GithubService.getSubscriptions().then(function (subs) {
      if (repo.subscribed) {
        if ((index = subs.indexOf(repo.id)) > -1){
          subs.splice(index, 1);
        }
        chrome.extension.getBackgroundPage().GithubService.unsubscribe(repo.id);
      } else {
        subs.push(repo.id);
        chrome.extension.getBackgroundPage().GithubService.subscribe(repo.id);
      }
      StorageService.set('subscriptions', subs);
    });
  };
}
