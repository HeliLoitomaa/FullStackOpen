const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('persondata', (req, res) => { 
  let person = ' '
  if(req.body){
    person = {name: req.body.name, number: req.body.number}
  }
  return JSON.stringify(person)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :persondata') )

let persons = [
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
]

const generatePersonId = (person) => {
  let genId
  do{
    genId = Math.floor(Math.random()*10000)
    person.id = genId
  } while (persons.find(existing => existing.id === genId))
  return person
   
}


app.get('/info', (req, res) => {
  const personCount = persons.length
  const date = new Date()
    res.send(`<div><p>Phonebook has info for ${personCount} people</p></div>
    <div>${date}</div>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person){
    res.json(person)
  }else{
    res.status(400).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(200).end()
})

app.post('/api/persons', (req, res) => {
  let person = req.body  
  if( !person.name ){
    return res.status(400).json({error: 'name missing'})
  } else if( !person.number ){
    return res.status(400).json({error: 'number missing'})
  } else if( persons.find(existing => existing.name === person.name)  ){
    return res.status(400).json({error: 'person already added'})
  }
  
  person = generatePersonId(person)
  persons = persons.concat(person)
  res.json(person)
 
} )

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
