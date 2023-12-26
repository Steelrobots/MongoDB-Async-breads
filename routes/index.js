var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users');
});
router.get('/users/:id/todos', function(req,res,next){
  res.render('todos', {executor : req.params.id})
})
module.exports = router;
