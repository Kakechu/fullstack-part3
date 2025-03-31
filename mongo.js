const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]


const url = `mongodb+srv://laurakaisaleinonen:${password}@cluster0.yso66.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person
    .find({})
    .then(result => {
      result.forEach(note => {
        console.log(note)
        mongoose.connection.close()
      })
    })
} else {

  const nameToAdd = process.argv[3]

  const numberToAdd = process.argv[4]

  const person = new Person({
    name: nameToAdd,
    number: numberToAdd
  })


  person.save().then(() => {
    console.log(`person added ${nameToAdd} number ${numberToAdd} to phonebook!`)
    mongoose.connection.close()
  })

}










