var host = "http://127.0.0.1:4567/faye",
  client = new Faye.Client(host);

Faye.URI.isSameOrigin = function () { return true; }
client.endpoint.path = host;
client.subscribe('/test', function (msg) {
  var data = JSON.parse(msg.payload);
  console.log('event', data);
  NotificationFactory.createNotification(data);
});
