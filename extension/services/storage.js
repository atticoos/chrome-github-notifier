angular.module('githubNotifierApp')
.factory('StorageService', function StorageService ($window, $q, $rootScope) {

  return {
    set: function (key, value) {
      var deferred = $q.defer(),
          obj = {};
      obj[key] = value;

      $window.chrome.storage.local.set(obj, function (data) {
        deferred.resolve(data);
        $rootScope.$apply();
      });
      return deferred.promise;
    },
    get: function (key, value) {
      var deferred = $q.defer();
      $window.chrome.storage.local.get(key, function (data) {
        if (data.hasOwnProperty(key)) {
          deferred.resolve(data[key]);
        } else {
          deferred.reject();
        }
        $rootScope.$apply();
      });
      return deferred.promise;
    }
  }
});
