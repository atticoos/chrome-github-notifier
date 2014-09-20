var express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    faye = require('faye'),
    app = express(),
    server = http.createServer(app),
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45}),
    router;

bayeux.attach(server);
router = express.Router();

app.use(function (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// handle webhooks
router.route('/payload').post(function (req, res) {
  var data = {
    event: req.headers['x-github-event'],
    payload: JSON.parse(req.body.payload)
  };
  console.log('Webhook ', data.event, data.payload.action);
  bayeux.getClient().publish('/' + data.payload.repository.id, data);
  res.status(200).json({message: 'received'});
});

router.route('/github/oauth').get(function (req, res) {
  console.log('req', req.params);
  console.log('query', req.query);
  res.json();
});

app.use('/', router);
server.listen(4567);

bayeux.on('handshake', function (clientID) {
  console.log('handshake', clientID);
});
bayeux.on('subscribe', function (a) {
  console.log('subbed', a);
});
