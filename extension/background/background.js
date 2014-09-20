var GithubService = {};

(function () {
  var host = "https://2a13aef.ngrok.com/faye",
      client = new Faye.Client(host),
      subscriptions = {};

  //Faye.URI.isSameOrigin = function () { return true; };
  //client.endpoint.path = host;
  client.on('transport:up', function () {
    console.log('transport:up');
  })
  client.on('transport:down', function () {
    console.log('transport:down');
    // attempt fallback retries
  });

  GithubService.subscribe = function (endpoint) {
    if (!subscriptions.hasOwnProperty(endpoint)) {
      console.log('subscribing', endpoint);
      subscriptions[endpoint] = client.subscribe('/' + endpoint, function (msg) {
        console.log('msg', msg);
        NotificationFactory.createNotification(msg.payload);
      });
    }
  };

  GithubService.unsubscribe = function (endpoint) {
    if (subscriptions.hasOwnProperty(endpoint)) {
      console.log('unsubscribing', endpoint);
      subscriptions[endpoint].cancel();
      delete subscriptions[endpoint];
    }
  };

  GithubService.listenForTokenCode = function () {
    var deferred = Q.defer(),
        githubConnectUrl = 'http://2a13aef.ngrok.com/github/oauth',
        listener;
    listener = function () {
      chrome.tabs.getAllInWindow(null, function (tabs) {
        for (var i = 0, tab; i < tabs.length; i++) {
          tab = tabs[i];
          if (tab.url.indexOf(githubConnectUrl) > -1) {
            var parts = tab.url.split('?code=');
            if (parts.length > 1) {
              parts = parts[1].split('&');
              chrome.tabs.remove(tab.id);
              chrome.tabs.onUpdated.removeListener(listener);
              deferred.resolve(parts[0]);

              reqwest({
                url: 'https://github.com/login/oauth/access_token',
                method: 'post',
                type: 'json',
                data: {
                  "client_id":"cc7aa902cef7b94d7647",
                  "client_secret":"c965b4a5a75144d448747975184095c17da376cc",
                  "code":parts[0],
                  "state":"asdf123"
                }
              }).then(function (resp) {
                chrome.storage.local.set({'token': resp.access_token});
              });
            }
          }
        }
      });
    };
    chrome.tabs.onUpdated.addListener(listener);
    return deferred.promise;
  }

  chrome.storage.local.get('subscriptions', function (data) {
    var repo;
    if (data.subscriptions) {
      for (var i = 0; i < data.subscriptions.length; i++) {
        repo = data.subscriptions[i];
        GithubService.subscribe(repo);
      }
    }
  });

})();
var TABX;
