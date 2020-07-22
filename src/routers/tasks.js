const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()

/**
 * Tasks
 */
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

// GET /tasks?completed=true   Filtering
// GET /tasks?limit=2&skip=2   Pagination
// GET /tasks?sortBy=createdAt_desc    Sorting
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    const completed = req.query.completed
    const sortBy = req.query.sortBy

    if (completed) {
        match.completed = completed === 'true'
    }

    if (sortBy) {
        const [field, order] = sortBy.split('_')
        sort[field] = order === 'desc' ? -1 : 1
    }

    try {
        // Populating virtual field with list of tasks for the user
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task not found!' })
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdated = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdated.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task not found!' })
        }

        updates.forEach(updateField => task[updateField] = req.body[updateField])
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send({ error: 'Task not found!' })
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
