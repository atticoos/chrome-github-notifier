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
  console.log('received', req.body, req.params);
  bayeux.getClient().publish('/test', req.body);
  res.status(200).json({message: 'received'});
});

app.use('/', router);
server.listen(4567);

bayeux.on('handshake', function (clientID) {
  console.log('handshake', clientID);
});
bayeux.on('subscribe', function (a) {
  console.log('subbed', a);
});
