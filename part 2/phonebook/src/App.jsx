import { useState } from 'react'
import Filter from './components/Filter'
import NewContactForm from './components/NewContactForm'
import AllContacts from './components/AllContacts'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const notNewPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase()) 

    notNewPerson ? alert(`${newName} is already added to phonebook`) : setPersons(persons.concat(nameObject))
    
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