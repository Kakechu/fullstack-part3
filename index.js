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



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => {
        console.log(error)
        response.status(400).send( {error: 'malformatted id'} )
      })

})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log("body", body)

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

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })