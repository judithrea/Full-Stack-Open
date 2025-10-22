require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
//const cors = require('cors')

const app = express()

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: "1"
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: "2"
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: "3"
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: "4"
    }
  ]

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(cors())

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
  res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const infoText = `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`
  res.send(infoText)
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
  // const id = req.params.id
  // const person = persons.find(p => p.id === id)
  // if (person) {
  //   res.json(person) 
  // } else {
  //   res.status(404).end()
  // }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

// const generateId = () => {
//   const id = Math.floor(Math.random() * 1e6)
//   return String(id)
// }

app.post('/api/persons', (req ,res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number missing' 
    })
  } 
  
  // else if (persons.find(person => person.name === body.name)) {
  //   return res.status(400).json({ 
  //     error: 'name must be unique' 
  //   }) 
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    //id: generateId(),
  })

  //persons = persons.concat(person)
  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})