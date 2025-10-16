import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import NewContactForm from './components/NewContactForm'
import AllContacts from './components/AllContacts'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const notNewName = persons.find(person => person.name.toLowerCase() === newName.toLowerCase()) 
    
    const notNewNumber = persons.find(person => person.number === newNumber)
    
    const differentNumber = persons.find(person => person.name.toLowerCase() === newName.toLowerCase() && person.number !== newNumber)
    
    differentNumber && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) ? 
      personService
        .update(notNewName.id, nameObject)
        .then(updatedPerson => {
          setPersons(prevPersons => prevPersons.map(person => person.id === notNewName.id ? updatedPerson : person))
          setNotification({
            message: `Sucessfully updated ${updatedPerson.name}`,
            type: 'success'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        }) 
        .catch(error => {
          setNotification({
            message: `${nameObject.name} has already been deleted`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(prevPersons => prevPersons.filter(person => person.id !== notNewName.id))
        })
    :  
      notNewName && notNewNumber ? 
        alert(`${newName} is already added to phonebook`)
      :
        personService 
          .create(nameObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNotification({
              message: `Sucessfully created ${returnedPerson.name}`,
              type: 'success'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
    
    setNewName('')
    setNewNumber('')
  }

   const handleDeletePerson = (id, name) => {
    window.confirm(`Delete ${name}?`) ? 
      personService
        .remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
          setNotification({
            message: `Sucessfully deleted ${name}`,
            type: 'success'
          })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
        })
    : undefined
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new contact</h2>
      <NewContactForm 
        onSubmit={addName}
        nameValue={newName} 
        onNameChange={handleNameChange}
        numberValue={newNumber} 
        onNumberChange={handleNumberChange}
      />
      <h2>Contacts</h2>
      <AllContacts filter={filter} filteredPersons={filteredPersons} persons={persons}
      handleDeletePerson={handleDeletePerson}/>
    </div>
  )
}

export default App