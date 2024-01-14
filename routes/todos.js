const express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb');


module.exports = function (db) {
    const Todo = db.collection('todos')
    const User = db.collection('users')
    router.get('/', async function (req, res, next) {
        try {
            const { page = 1, limit = 10, title, complete, startDeadline, endDeadline, sortBy = '_id', sortMode = 'desc', executor } = req.query
            const params = {}
            const sort = {}
            sort[sortBy] = sortMode
            const offset = (page - 1) * limit

            if (title) {
                params['title'] = new RegExp(title, 'i')
            }

            if (startDeadline && endDeadline) {
                params['deadline'] = {
                    $gte: new Date(startDeadline),
                    $lte: new Date(endDeadline)
                }
            } else if (startDeadline) {
                params['deadline'] = { $gte: new Date(startDeadline) }
            } else if (endDeadline) {
                params['deadline'] = { $lte: new Date(endDeadline) }
            }

            if (complete) {
                params['complete'] = JSON.parse(complete)
            }
            if (executor) {
                params['executor'] = new ObjectId(executor)
            }
            const total = await Todo.count(params)
            const pages = Math.ceil(total / limit)

            const todos = await Todo.find(params).sort(sort).limit(Number(limit)).skip(offset).toArray()
            res.json({ data: todos, limit: Number(limit), page, pages, total })
        } catch (err) {
            res.status(500).json(err)
        }
    })
    router.get('/:id', async function (req, res) {
        try {
            const id = req.params.id
            const todo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(201).json(todo)

        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
    router.post('/', async function (req, res) {
        try {
            const { title, executor } = req.body
            const user = await User.findOne({ _id: new ObjectId(executor) })
            const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
            const todo = await Todo.insertOne({ title: title, complete: false, deadline: date, executor: user._id })
            const data = await Todo.find({ _id: new ObjectId(todo.insertedId) }).toArray()
            res.status(201).json(data)
        } catch (error) {
            res.status(500).json({ error: error.message })

        }
    })
    router.put('/:id', async function (req, res) {
        try {
            const id = req.params.id
            const { title, deadline, complete } = req.body
            const todo = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, complete: JSON.parse(complete), deadline: new Date(deadline) } }, { returnDocument: 'after' });
            res.status(201).json(todo)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
    router.delete('/:id', async function (req, res) {
        try {
            const id = req.params.id
            const todo = await Todo.findOneAndDelete({ _id: new ObjectId(id) })
            res.json(todo)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
    return router;

}
