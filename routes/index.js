var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ICK API VIA EXPRESS JLR PIPE.' });
});

router.all('*', function(req, res, next) {
  const path = req.path;
  const method = req.method;
  res.status(404).json({status: "err", message: `404 Not Found => ${method} ${path} Not Found`});
});

module.exports = router;
