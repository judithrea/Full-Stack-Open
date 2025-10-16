const AllContacts = ({ filter, filteredPersons, persons, handleDeletePerson }) => 
  <div>
    {filter.length > 0 ?
      filteredPersons.length > 0 ?
        <ul>
          {filteredPersons.map(person =>
            <div key={person.name}>
              <li>
                {person.name} {person.number}
              </li>
            </div>)
          }
        </ul>
        : <p>No matches.</p>
      :
      <ul>
        {persons.map(person =>
          <div key={person.name}>
            <li>
              {person.name} {person.number} <button onClick={() => handleDeletePerson(person.id, person.name)}>delete</button>
            </li>
          </div>
        )}
      </ul>}
  </div>

export default AllContacts