const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOneId, userOne, configureDB, closeDB } = require('./fixtures/db')
const { userTwo, taskOne, taskTwo, taskThree } = require('./fixtures/db')

//Create and close DB for tests
beforeEach(configureDB)
afterAll(closeDB)

test('Should create task for user', async () => {
    const response = await request(app)
                                .post('/tasks')
                                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                                .send({
                                    description: 'bring out the trash',
                                    completed: false
                                })
                                .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()

    expect(task.description).toBe('bring out the trash')
    expect(task.completed).toBe(false)
})

test('Should return all tasks for given user', async () => {
    const response = await request(app)
                        .get('/tasks')
                        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                        .expect(200)
    
    expect(response.body.length).toBe(2)

})

test('Should not allow user to delete unowned task', async () => {
    const response = await request(app)
                            .delete(`/tasks/${taskOne._id}`)
                            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
                            .send()
                            .expect(404)
    
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})