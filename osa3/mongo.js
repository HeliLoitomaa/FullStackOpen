const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://heliloitomaa:${password}@cluster0.eiywuwh.mongodb.net/phoneApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if(name){
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}else{
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(p => {
          console.log(p.name, p.number)
        });  
        mongoose.connection.close()
      })
}



