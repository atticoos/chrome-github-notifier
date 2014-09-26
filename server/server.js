var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    http = require('http'),
    faye = require('faye'),
    subscriptionValidator = require('./subscriptionValidator'),
    port = 4567;


function GithubNotifierServer () {
  this.setupHttpServer();
  this.setupFayeServer();
}


GithubNotifierServer.prototype.setupHttpServer = function () {
  this.app = express();
  this.app.use(bodyParser.json());
  this.app.use(bodyParser.urlencoded({extended: false}));
  this.app.use(function (req, res, next) {
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
  });
  this.router = express.Router();
  this.router.route('/github/oauth').get(function (req, res) {
    console.log('req', req.params);
    console.log('query', req.query);
    res.json();
  });
  this.router.route('/payload').post(function (req, res) {
    var data = {
      event: req.headers['x-github-event'],
      payload: JSON.parse(req.body.payload)
    };
    console.log('Webhook ', data.event, data.payload.action, data.payload.repository.id);
    this.fayeClient.publish('/' + data.payload.repository.id, data);
    res.status(200).json({message: 'received'});
  }.bind(this));
  this.app.use('/', this.router);
  this.httpServer = http.createServer(this.app);
};

GithubNotifierServer.prototype.setupFayeServer = function () {
  this.fayeServer = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
  });
  this.fayeServer.addExtension({
    incoming: function (message, callback) {
      if (message.subscription) {
        subscriptionValidator.validate(message.token, message.subscription).catch(function () {
          message.error = 'Unauthorized Request';
        }).finally(function () {
          callback(message);
        });
      } else {
        callback(message);
      }
    }
  });
  this.fayeServer.attach(this.httpServer);
  this.fayeClient = this.fayeServer.getClient();
};

GithubNotifierServer.prototype.start = function () {
  this.httpServer.listen(port);
}

module.exports = GithubNotifierServer;
