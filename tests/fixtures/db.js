const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Ciro',
    email: 'ciruzzo@sistema.it',
    password: 'casatiello18',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Mike',
    email: 'mike@domain.com',
    password: 'MikesPassword123!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn React',
    completed: false,
    owner: userOneId,
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Angular',
    completed: true,
    owner: userOneId,
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn Java',
    completed: true,
    owner: userTwoId,
}

const setupDatabase = async () => {
    // Clearing DB
    await User.deleteMany()
    await Task.deleteMany()

    // Creating Users data
    await new User(userOne).save()
    await new User(userTwo).save()

    // Creating Tasks data
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
}
