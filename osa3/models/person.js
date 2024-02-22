const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v){
        return  /(^\d{2,3}[\-][0-9]{6,})/.test(v)
      },
      message: props => `${props.value} is not valid phone number`
    },
  }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)