angular.module('githubNotifierApp')
.controller('ReposCtrl', ReposCtrl);
function ReposCtrl ($scope, $http, $window, GithubService, StorageService) {
  $scope.repos = {};
  console.log('repo ctrl');

  GithubService.getRepositories().then(function (repos) {
    angular.forEach(repos, function (repo) {
      if (!$scope.repos.hasOwnProperty(repo.owner.id)) {
        $scope.repos[repo.owner.id] = {
          owner: repo.owner,
          repositories: []
        }
      }
      $scope.repos[repo.owner.id].repositories.push(repo);
    });
    console.log('repos', $scope.repos);

    return GithubService.getSubscriptions();
  }).then(function (subs) {
    angular.forEach($scope.repos, function (repoGroup) {
      angular.forEach(repoGroup.repositories, function (repo) {
        if (subs.indexOf(repo.id) > -1) {
          repo.subscribed = true;
        } else {
          repo.subscribed = false;
        }
      })
    });
  });

  $scope.sub = function (repo) {
    var index;
    GithubService.getSubscriptions().finally(function (subs) {
      if (!subs) {
        subs = [];
      }
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

  $scope.subCount = function (group) {
    return group.repositories.reduce(function (prev, current) {
      if (current.subscribed) {
        prev++;
      }
      return prev;
    }, 0);
  }
}
