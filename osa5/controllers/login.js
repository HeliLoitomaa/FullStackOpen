const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  console.log('username', username)
  const user = await User.findOne({ username })

  const pwCorrect = user === null 
    ? false 
    : await bcrypt.compare(password, user.passwordHash)

  if(!(user && pwCorrect)){
    response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({token, username: user.username, name: user.name })


})

module.exports = loginRouter