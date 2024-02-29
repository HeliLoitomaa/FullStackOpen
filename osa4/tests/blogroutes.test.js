const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const initialDB = require('../utils/list_helper').initialBlogDB
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

describe(('with db initialized '), () => {
  let authToken = {}
  beforeEach(async ()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialDB)
    const user = {
      "username": "root",
      "password": "sekret"
    }    
    const response = await api.post('/api/login')
      .send(user)
      .expect(200) 
      authToken =  response.body.token
      assert(authToken.length > 0)

  })
  
  describe('test existing blog',  () => {
    test(' should return two blog', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, 2)
    })
  
    test('should be JSON type', async () => {
      await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })
  
    test('should contain id instead of _id', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(Object.hasOwn(response.body[0], 'id'), true)
      assert.strictEqual(Object.hasOwn(response.body[0],'_id'), false)
    })
  })
  describe('add, remove and update a blog', () => { 
    test('should be able to add a blog', async () => {
      const newBlog = { 
        "title": "A CUP OF JO",
        "author": "Joanna Goddard",
        "url": "http://cupofjo.com/",
        "likes": 0
      }   
      await api.post('/api/blogs')
            .send(newBlog).set({'authorization': `Bearer ${authToken}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)          
  
      response = await api.get('/api/blogs')
      const currCount = response.body.length
      assert.strictEqual(currCount, initialDB.length + 1)
  
      const titles = response.body.map(blog => blog.title)
      assert(titles.includes('A CUP OF JO'))
    })
  
    test('likes is 0 if no value present', async () => {
      const newBlog = { 
        "title": "A CUP OF JO",
        "author": "Joanna Goddard",
        "url": "http://cupofjo.com/"
      } 
      await api.post('/api/blogs')
            .send(newBlog).set({'authorization': `Bearer ${authToken}`})
            .expect(201)
            .expect('Content-Type', /application\/json/)          
  
      const response = await api.get('/api/blogs')
      const lastIndex = response.body.length
      const likesOfJo = response.body[lastIndex - 1].likes
      assert.strictEqual(likesOfJo, 0)
    })

    test('should delete blog', async () => {
      const response = await api.get('/api/blogs')
      const initialCount = response.body.length
      const deleteId = response.body[0].id
      
      await api.delete(`/api/blogs/${deleteId}`).expect(204)
      const newResponse = await api.get('/api/blogs')

      assert.strictEqual(newResponse.body.length, initialCount - 1)
    })

    test('should update blog', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]
      const initialLikes = blog.likes
      const updateblog = {
        ...blog,
        likes: 8
      }    
      const result = await api.put(`/api/blogs/${updateblog.id}`).send(updateblog).expect(200)
      const returnedBlog = result.body
      assert.notEqual(initialLikes, returnedBlog.likes)
      assert.strictEqual(returnedBlog.likes, 8)
    })
    
  
  })

}) 


after(async () => {
  await mongoose.connection.close()
})