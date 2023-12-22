var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();


module.exports = function (db) {
    const Todo = db.collection('todos')
    const User = db.collection('users')
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

    router.post('/', async function (req, res) {
        try {
            const { title, executor } = req.body
            const user = await User.findOne({ _id: executor })
            const todo = await Todo.insertOne({ title: title, complete: false, executor: new ObjectId(user._id) })
            res.json(todo)
        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    })

}
