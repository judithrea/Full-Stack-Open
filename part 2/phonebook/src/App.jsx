import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import NewContactForm from './components/NewContactForm'
import AllContacts from './components/AllContacts'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const baseUrl = 'http://localhost:3001/persons'

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

    const notNewPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase()) 

    notNewPerson ? alert(`${newName} is already added to phonebook`) : 
    personService 
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    
    setNewName('')
    setNewNumber('')
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
      <AllContacts filter={filter} filteredPersons={filteredPersons} persons={persons}/>
    </div>
  )
}

export default App