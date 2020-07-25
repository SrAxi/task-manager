const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOneId,
    userOne,
    setupDatabase,
} = require('./fixtures/db')

describe('Users CRUD', () => {
    beforeEach(setupDatabase)

    it('should create/signup a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'Riccardo',
                email: 'riccardo@example.com',
                password: 'MyPassw0rd!'
            })
            .expect(201)

        // Assert that the DB has changed correctly
        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

        // Assertions about the response
        expect(response.body).toMatchObject({
            user: {
                name: 'Riccardo',
                email: 'riccardo@example.com'
            },
            token: user.tokens[0].token
        })
        expect(user.password).not.toBe('MyPassw0rd!')
    })

    it('should return error when trying to create a user with existing email', async () => {
        await request(app)
            .post('/users')
            .send({
                name: 'Fail user',
                email: userOne.email,
                password: 'MyPassw0rd!'
            })
            .expect(400)
    })

    it('should login an existing user', async () => {
        const response = await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: userOne.password
            })
            .expect(200)

        // Assert that the a new token has been created for this login session
        const user = await User.findById(userOneId)
        expect(response.body.token).toBe(user.tokens[1].token)
    })

    it('should return error when trying to login with wrong credentials', async () => {
        await request(app)
            .post('/users/login')
            .send({
                email: userOne.email,
                password: 'userOne.password'
            })
            .expect(400)
    })

    it('should return error when trying to login with an email that doest not exist', async () => {
        await request(app)
            .post('/users/login')
            .send({
                email: 'whatever',
                password: 'test'
            })
            .expect(400)
    })

    it('should get profile for user', async () => {
        const response = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        // Assert that the returned data is correct
        expect(response.body).not.toBeNull()
        expect(response.body.email).toBe(userOne.email)
    })

    it('should return error when trying to get profile for user while not authorized', async () => {
        await request(app)
            .get('/users/me')
            .send()
            .expect(401)
    })

    it('should be able to delete a user', async () => {
        await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200)

        // Assert that the DB has changed correctly
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
    })

    it('should return error when trying to delete a user while not authorized', async () => {
        await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
    })

    it('should upload avatar image', async () => {
        await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

        // Assert that the avatar was saved properly
        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))
    })

    it('should return an error when trying to upload avatar image that does is not supported', async () => {
        const response = await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/sample-pdf-file.pdf')
            .expect(400)

        // Assert that proper error message has been returned
        expect(response.body.error).toBe('File type not supported. Suppored files: JPG, JPEG & PNG.')
    })

    it('should be able to update current user', async () => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Genariello',
                email: 'nuova@sistema.it'
            })
            .expect(200)

        // Assert that changes in the DB have been done successfully
        const user = await User.findById(userOneId)
        expect(user.name).toBe('Genariello')
        expect(user.email).toBe('nuova@sistema.it')
    })

    it('should return an error when trying to update a user passing wrong data', async () => {
        await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: '',
                email: 'nuova@sistema.it'
            })
            .expect(400)

        const response = await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                tokens: '',
            })
            .expect(400)

        // Assert that changes in the DB have been done successfully
        expect(response.body.error).toBe('Invalid Updates!')
    })
})

