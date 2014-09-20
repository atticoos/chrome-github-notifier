angular.module('githubNotifierApp')
.controller('NotificationsCtrl', function ($scope, GithubService) {
  console.log('notification ctlr');
  $scope.notifications = {};
  GithubService.getNotifications().then(function (notifications) {
    $scope.notifications = notifications.reduce(function (prev, cur) {
      if (!prev.hasOwnProperty(cur.repository.id)) {
        prev[cur.repository.id] = {
          repository: cur.repository,
          notifications: []
        };
      }
      prev[cur.repository.id].notifications.push(cur);
      return prev;
    }, {});
    console.log('notif', $scope.notifications);
  });

});
