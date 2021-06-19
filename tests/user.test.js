const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, configureDB, closeDB} = require('./fixtures/db')

//Configure and shut down DB for tests
beforeEach(configureDB)
afterAll(closeDB)

test('Should signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'JP',
        email: 'jptest@example.com',
        password: 'MyPassw777!'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'JP',
            email: 'jptest@example.com',
        },
        token: user.tokens[0].token
    })

    expect(response.body.user.password).not.toBe('MyPassw777!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'abademail@gmail.com',
        password: 'random1234@#'
    }).expect(400)
})

test('Should return user profile', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({})
            .expect(200)
})

test('Should not return profile for unauthenticated user', async () => {
    await request(app)
            .get('/users/me')
            .send({})
            .expect(401)
})

test('Should not delete profile for unauthenticated user ', async () => {
    await request(app)
            .delete('/users/me')
            .send({})
            .expect(401)
})

test('Should delete a user account', async () => {
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({})
            .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should upload avatar image', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                name: 'Paul'
            })
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Paul')
})

test('Should not update invalid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                random: 'Hello There'
            })
            .expect(400)
})