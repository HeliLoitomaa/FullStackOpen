
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  console.log('auth=', authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    console.log('authorization', authorization)
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
    
})
  
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  console.log('body=', body)
  const token = getTokenFrom(request)
  console.log('token', token)
  console.log('auth in req=', request.get('Authorization'))
  let decodedToken  = {}
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)    
  } catch (error) {
    console.log('error', error, next)
  } 
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)    
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const userid = blog.user.id
  const updatedblog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedblog)
})

  module.exports = blogsRouter