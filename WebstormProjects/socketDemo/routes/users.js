var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/chatPage', function(req, res) {
  res.render('chatPage');
});

module.exports = router;
