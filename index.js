require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
const morgan = require('morgan')



// Making sure the body has a name and number, otherwise return "-"
morgan.token('body', (request) => {
    if (request.body.name && request.body.number) {
        return JSON.stringify( {name: request.body.name , number: request.body.number} )
    }
    return '-'
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        console.log(error.message)
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const date = new Date()
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${String(date)}</p>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
      })
      .catch(error => next(error))  
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    //console.log("body", body)
    /*
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
    */
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

    person.save()
      .then(savedPerson => {
          response.json(savedPerson)
      })
      .catch(error => next(error))

})


app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
      .then(person => {
        if (!person) {
            return response.status(404).end()
        }

        person.name = name
        person.number = number
        
        return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
        })        
      })
      .catch(error => next(error))

})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })