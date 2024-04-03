const { test, after, beforeEach, describe } = require('node:test')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const usersInDb = require('../utils/list_helper').usersInDb


describe('Add blog with one user login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('login succeeds and returns token', async () => {
    const usersAtStart = await usersInDb()
    const user = {
      "username": "root",
      "password": "sekret"
    }
    const response = await api.post('/api/login')
    .send(user)
    .expect(200)
    assert.strictEqual(response.body.username, 'root')
    assert.notEqual(response.body.token, null)
    assert(response.body.token.length > 0)
    console.log(response.body.token)
  })

  test('blog cannot be added without valid token', async () => {
    const user = {
      "username": "root",
      "password": "sekret"
    } 

    const newBlog = { 
      "title": "A CUP OF JO",
      "author": "Joanna Goddard",
      "url": "http://cupofjo.com/",
      "likes": 0
    }  
    const token = 'invalidwpHsb8RZJEM7OUoKbW6h4AnDwqRg'
    await api.post('/api/blogs')    
    .send(newBlog).set({'authorization': `Bearer ${token}`})
    .expect(401)
    .expect('Content-Type', /application\/json/)     
  })

  test('blog can be added with a token', async () => {
    const user = {
      "username": "root",
      "password": "sekret"
    }
    
    const response = await api.post('/api/login')
      .send(user)
      .expect(200) 
      const token =  response.body.token
      assert(token.length > 0)

    const newBlog = { 
      "title": "A CUP OF JO",
      "author": "Joanna Goddard",
      "url": "http://cupofjo.com/",
      "likes": 0
    }  
    
    await api.post('/api/blogs')    
    .send(newBlog).set({'authorization': `Bearer ${token}`})
    .expect(201)
    .expect('Content-Type', /application\/json/)     
  })
  
})



after(async () => {
  await mongoose.connection.close()
})