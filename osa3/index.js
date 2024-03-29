/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('persondata', (req, res) => {
  let person = ' '
  if(req.body){
    person = { name: req.body.name, number: req.body.number }
  }
  return JSON.stringify(person)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persondata') )

/* let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
] */

/* const generatePersonId = (person) => {
  let genId
  do{
    genId = Math.floor(Math.random()*10000)
    person.id = genId
  } while (persons.find(existing => existing.id === genId))
  return person
} */


app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const personCount = persons.length
    const date = new Date()
    res.send(`<div><p>Phonebook has info for ${personCount} people</p></div>
    <div>${date}</div>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(returnPerson => {
      if(returnPerson){
        res.json(returnPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end()
    })
    .catch (error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(id, person)
    .then(result => {
      res.status(204).end()
    })
    .catch (error =>  next(error))
})

app.post('/api/persons', (req, res, next) => {
  let person = req.body
  if (person.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })

  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
} )

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error)
  if (error.name === 'CastError') {
    return res.status(400).send({ error:'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
