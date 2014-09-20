var NotificationFactory = {};
(function () {
  var eventCache = {},
      createNotification;

  createNotification = function (title, message) {
    var notificationID = 'notif_' + (new Date()).getTime().toString();

    title = title || '';
    message = message || '';

    chrome.notifications.create(notificationID, {
      type: "basic",
      iconUrl: 'github.png',
      title: title,
      message: message
    }, function () {});

    return notificationID;
  };

  chrome.notifications.onClicked.addListener(function (notificationID) {
    var event;
    if (eventCache.hasOwnProperty(notificationID)) {
      event = eventCache[notificationID];
      if (NotificationFactory.clicked.hasOwnProperty(event.action)) {
        NotificationFactory.clicked[event.action].call(this, event);
        delete eventCache[notificationID];
      }
    }
  });


  NotificationFactory.createNotification = function (event) {
    if (this.create.hasOwnProperty(event.action)) {
      this.create[event.action].call(this, event);
    }
  };

  NotificationFactory.create = {
    // comment created
    created: function (event) {
      var title = sprintf("%s commented on %s#%s", event.sender.login, event.repository.full_name, event.issue.number),
          msg = event.comment.body,
          notification = createNotification(title, msg);

      eventCache[notification] = event;
    },

    // issue closed
    closed: function (event) {
      var title = sprintf("%s closed %s#%s", event.sender.login, event.repository.full_name, event.issue.number),
          msg = '',
          notification = createNotification(title, msg);

      eventCache[notification] = event;
    },

    // is oepened
    opened: function (event) {
      var title = sprintf("%s opened %s#%s", event.sender.login, event.repository.full_name, event.issue.number),
          msg = event.issue.title,
          notification = createNotification(title, msg);

      eventCache[notification] = event;
    },

    // issue reopenned
    reopened: function (event) {
      var title = sprintf("%s reopened %s#%s", event.sender.login, event.repository.full_name, event.issue.number),
          msg = event.issue.body,
          notification = createNotification(title, msg);

      eventCache[notification] = event;
    }
  };

  NotificationFactory.clicked = {
    created: function (event) {
      chrome.tabs.create({ url: event.comment.html_url });
    },
    opened: function (event) {
      chrome.tabs.create({ url: event.issue.html_url });
    },
    reopened: function (event) {
      chrome.tabs.create({ url: event.issue.html_url });
    },
    closed: function (event) {
      chrome.tabs.create({ url: event.issue.html_url });
    }
  };
})();
