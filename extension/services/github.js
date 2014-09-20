angular.module('githubNotifierApp')
.factory('GithubService', function GithubService ($window, $q, $rootScope, $http, StorageService) {
  var background = $window.chrome.extension.getBackgroundPage(),
      fetchRepos;

  fetchRepos = function (token, page, repos) {
    page = page || 1;
    repos = repos || [];

    return $http.get('https://api.github.com/user/subscriptions?per_page=100&page=' + page, {
      headers: {
        Authorization: 'token ' + token
      }
    }).then(function (response) {
      var responseRepos = response.data;
      repos.push.apply(repos, responseRepos);
      if (responseRepos.length > 0) {
        return fetchRepos(token, page+1, repos);
      } else {
        return repos;
      }
    });
  };

  return {
    connect: function () {
      $window.chrome.tabs.create({url:'https://github.com/login/oauth/authorize?client_id=cc7aa902cef7b94d7647&redirect_uri=http://2a13aef.ngrok.com/github/oauth&scope=write:repo_hook,read:org,write:repo_hook,read:org,repo&state=asdf123'});
      return background.GithubService.listenForTokenCode().then(function (code) {

      });
    },
    getAccessToken: function () {
      return StorageService.get('token');
    },
    getRepositories: function () {
      var deferred = $q.defer();


      StorageService.get('repos').then(function (repos) {
        if (!angular.isArray(repos) || repos.length === 0) {
          return false;
        } else {
          return repos;
        }
      }, function (error) {
        return false;
      }).then(function (resp) {
        if (resp === false) {
          this.getAccessToken().then(function (token) {
            return fetchRepos(token);
          }, function (error) {

            deferred.reject(error);
          }).then(function (repos) {
            StorageService.set('repos', repos);
            deferred.resolve(repos);
          });
        } else {
          deferred.resolve(resp);
        }
      }.bind(this));

      return deferred.promise;
    },
    getSubscriptions: function () {
      return StorageService.get('subscriptions').then(function (subs) {
        if (!angular.isArray(subs)) {
          subs = [];
        }
        return subs;
      });
    }
  }
});
