import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from './services/personservice'

function App() {
  /*state */
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({message:'', error: false})

  /*EffectHooks */
  useEffect(() => {
    fetchPersons()
  }, []) 

  /*Event handlers */
  const addNewPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newPhone }
    const existingperson = persons.find((person) => person.name === newPerson.name )
    if(existingperson){
      updatePerson(existingperson, newPerson)
    } else{
      personService.create(newPerson)
      .then(response => {
        console.log("created person data=",response.data)
      setPersons(persons.concat(response.data))
      emptyNotificationAfter(`${newName} was added to phonebook`, 3000, false)  
      setNewName('')
      setNewPhone('')
      }).catch(error => {
        emptyNotificationAfter(`${error.response.data.error} `, 5000, true) 
      }) 
    
    } 
  }

  const handleName = (event) => {
    setNewName(event.target.value)
  }
  const handlePhone = (event) => {
    setNewPhone(event.target.value)
  }
  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }
  const handleDelete = (event) => {
    const id = event.target.value  
    console.log("id==", id)  
    let person = persons.find((person) => person.id === id )  
    console.log(persons)  
    console.log(person)
    /*Do not continue if canceled*/
    if(!window.confirm(`Delete ${person.name}?`)){return}     
    personService.removeWithId(id)
    .then( (result) => {
      if(result.status === 204){
        /*update*/
        fetchPersons()
        emptyNotificationAfter(`${person.name} was deleted from phonebook`, 3000, false)          
      }      
    })
   
  }

/*Helper methods */
  const updatePerson = (existing, newPerson) => {    
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)){
        personService.updatePerson(existing.id, newPerson)
        .then((result) => {
           /*update list*/
           fetchPersons()
           setNewName('')
           setNewPhone('')
          if(result.status === 204){           
            emptyNotificationAfter(`${existing.name} phone number was updated`, 3000, false)              
          }     
        }).catch(error => {
          /*update list*/
          fetchPersons()
          setNewName('')
          setNewPhone('')
          emptyNotificationAfter(`${existing.name} has already been removed from server`, 3000, true) 
        })
      }    
  }
  const filterPersons = () => {
    const returnPersons = newFilter === '' ? persons 
      : persons.filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    return returnPersons
  }
  
  const fetchPersons = () => {
    personService.getAll()
      .then(response => {
        setPersons(response.data)
      }).catch(error => {
        emptyNotificationAfter('Error getting data from server', 3000, true) 
      })
  }
  const emptyNotificationAfter = (message, timeout, error) => {
    setNotificationMessage({message: message, error: error}) 
      setTimeout(() => {
        setNotificationMessage({message: '', error: false})
      }, timeout);
  }
  

  return (    
      <div>
        <h1>Phonebook</h1>
        <Notification message={notificationMessage.message} error={notificationMessage.error}/>
        <Filter value={newFilter} handleFilter={handleFilter} />
        <h3>Add a new</h3>
        <PersonForm onSubmit={addNewPerson} nameValue={newName} onNameChange={handleName} 
          phoneValue={newPhone} onPhoneChange={handlePhone} />
        
        <h3>Numbers</h3>
        <ul style={{listStyle: "none"}}>
          <Persons persons={filterPersons()} clickHandler={handleDelete}/>
        </ul>
      </div>
  )
}

export default App
