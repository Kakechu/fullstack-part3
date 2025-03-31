const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

/*
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
*/
        /*
koostua kahdesta väliviivalla erotetusta osasta joissa ensimmäisessä osassa on 2 tai 3 numeroa ja toisessa osassa riittävä määrä numeroita

esim. 09-1234556 ja 040-22334455 ovat oikeassa muodossa
esim. 1234556, 1-22334455 ja 10-22-334455 eivät ole kelvollisia
        */
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: [true, 'name missing']
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'number missing'],
    validate:
      {
        validator: function(v) {
          const parts = v.split('-')
          
          // Vain 2 osaa eli vain yksi väliviiva
          if (parts.length !== 2) {
            return false
          }

          // Ensimmäinen osa ei saa olla alle 2 eli 0 tai 1 merkkiä pitkä. TAI se ei saa olla yli 3 merkkiä. Eli siis pitää olla 2 tai 3
          const firstPart = parts[0]
          if (firstPart.length < 2 || firstPart.length > 3 || isNaN(firstPart)) {
            return false
          }

          // Toisen osan on koostuttava numeroista.
          const secondPart = parts[1]
          if (isNaN(secondPart)) {
            return false
          }

          return true
        },
        
        message: props => `${props.value} is invalid! The number must consist of two parts, separated by a hyphen. The first part must contain 2 or 3 numbers.`
      }
  }
})



personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('Person', personSchema)

