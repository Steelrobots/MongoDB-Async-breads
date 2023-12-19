var express = require('express');
var router = express.Router();


module.exports = function (db){
    const User = db.collection('users')
    
    router.get('/', async function(req,res,next){
      try {
        const params = {}
        const users = await User.find(params).toArray()
        res.json(users)
      } catch (error) {
        
      }
    })
    return router;
};
