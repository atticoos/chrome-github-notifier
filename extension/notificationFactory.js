var NotificationFactory = {};
(function () {
  var create = function () {
    chrome.notifications.create('asdf', {
      type: "basic",
      iconUrl: 'github.png',
      title: 'Notification',
      message: 'An issue was created'
    }, function () {});
  }
  NotificationFactory.createNotification = function (title, message) {
    create();
  };
})();
