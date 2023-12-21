var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();


module.exports = function (db) {
  const User = db.collection('users')

  router.get('/', async function (req, res, next) {
    try {
      const { page = 1, limit = 5, query = '', sortBy, sortMode } = req.query
      const params = {}
      const sort = {}
      sort[sortBy] = sortMode
      const offset = (page - 1) * limit

      if (query) {
        params['$or'] = [{ "name": new RegExp(query, 'i') }, { "phone": new RegExp(query, 'i') }]
      }
      const total = await User.count(params)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).sort(sort).limit(Number(limit)).skip(offset).toArray()
      res.json({ data: users, limit: Number(limit), page, pages, offset, total })
    } catch (err) {
      res.status(500).json(err)
    }
  })

  router.post('/', async function (req, res) {
    try {
      const { name, phone } = req.body
      const user = await User.insertOne({ name, phone })
      res.json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  })

  router.put('/:id', async function (req, res) {
    try {
      const { name, phone } = req.body
      const id = req.params.id
      // const user = await User.findOne({ _id: id })
      const updatedUser = await User.findOneAndUpdate({ _id: new ObjectId(id) }, {$set: { name: name, phone: phone }})
      res.json(updatedUser)

    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  router.delete('/:id', async function(req,res){
    try {
      const id = req.params.id
      const user = await User.findOneAndDelete({_id: new ObjectId(id)})
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  return router;
};
