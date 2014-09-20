var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    router;


router = express.Router();

app.use(function (req, res, next) {
  req.headers['content-type'] = req.headers['content-type'] || 'application/json';
  next();
});


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));


router.route('/payload').post(function (req, res) {
  console.log('received', req.body, req.params);
  res.status(200).json({message: 'received'});
}).get(function (req, res) {
  res.write('wtf');
})

app.use('/', router);

app.listen(4567);
