angular.module('githubNotifierApp', ['ngRoute'])
.config(function ($routeProvider, $locationProvider) {
  var routeManifest,
      tokenResolve;

  tokenResolve = function ($q, StorageService) {
    var deferred = $q.defer();
    StorageService.get('token').then(function (token) {
      deferred.resolve(token);
    }, function () {
      deferred.resolve();
    });
    return deferred.promise;
  }

  routeManifest = {
    '/': {
      controller: 'IndexCtrl',
      template: 'index',
      resolve: {
        token: ['$q', 'StorageService', tokenResolve]
      }
    },
    '/login': {
      controller: 'LoginCtrl',
      templateUrl: 'views/login.html'
    },
    '/repos': {
      controller: 'ReposCtrl',
      templateUrl: 'views/repos.html'
    },
    '/notifications': {
      controller: 'NotificationsCtrl',
      templateUrl: 'views/notifications.html'
    }
  };

  angular.forEach(routeManifest, function (route, path) {
    $routeProvider.when(path, route);
  });
  $routeProvider.otherwise('/');
});
