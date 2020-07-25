const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task.js')
const {
    userOneId,
    userTwo,
    taskOne,
    userOne,
    setupDatabase,
} = require('./fixtures/db')

describe('Tasks CRUD', () => {
    beforeEach(setupDatabase)

    it('should be able to create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'Learn Vue'
            })
            .expect(201)

        // Assert that the DB has changed correctly
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
        expect(task.description).toBe('Learn Vue')
        expect(task.completed).toBe(false)
    })

    it('should be able get tasks for a given user', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        // Assert that the received data is correct
        expect(response.body.length).toBe(2)
        expect(response.body[0].description).toBe('Learn React')
        expect(response.body[0].completed).toBe(false)
        expect(response.body[1].description).toBe('Learn Angular')
        expect(response.body[1].completed).toBe(true)
    })

    it('should not delete other users tasks', async () => {
        await request(app)
            .delete(`/tasks/${taskOne._id}`)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404)

        // Accert that the task has not been deleted from the DB
        const task = await Task.findById(taskOne._id)
        expect(task).not.toBeNull()
    })
})