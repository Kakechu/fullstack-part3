require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')

app.use(express.json())

// Making sure the body has a name and number, otherwise return "-"
morgan.token('body', (request) => {
    if (request.body.name && request.body.number) {
        return JSON.stringify( {name: request.body.name , number: request.body.number} )
    }
    return '-'
})





//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))




/*
let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"      
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"      
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"      
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"      
    }
]
*/


const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

let date = new Date()

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${String(date)}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    
    /*
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    */
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("body", body)
    //const person = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    /*const nameExists = persons.some(person => person.name === body.name)

    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    //const id = Math.floor(Math.random() * 100000)
    //person.id = String(id)
    
    //persons = persons.concat(person)

    //response.json(person)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })