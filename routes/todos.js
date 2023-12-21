var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();


module.exports = function (db) {
  const User = db.collection('todos')

//   router.get('/', async function(req,res,next){
//     try {
//         const { page = 1, limit = 5, query = '', sortBy, sortMode } = req.query
//       const params = {}
//       const sort = {}
//       sort[sortBy] = sortMode
//       const offset = (page - 1) * limit
//     } catch (error) {
        
//     }
//   })

    router.post('/', async function(req,res){
        try {
            const {title, executor} = req.body
        } catch (error) {
            
        }
    })
}
