import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [allCountries, setCountries] = useState([])
  const [searchInput, setSearchInput] = useState('')

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(res => {
        setCountries(res.data)
      })
  }, [])

  const filteredCountries = allCountries.filter(country => 
    country.name.common.toLowerCase().includes(searchInput.toLowerCase()))
  
  const filteredNames = filteredCountries.map(country => country.name.common)
  
  const handleSearchCountry = (event) => {
    setSearchInput(event.target.value)
  }

  return (
    <div>
      find countries <input onChange={handleSearchCountry} type="text" />
      {filteredCountries.length === 1 ? 
        <div>
          <h1>{filteredNames}</h1>
          {filteredCountries.map(country => 
          <div key={country.name}>
          <p>{country.capital}</p>
          <p>{country.area}</p>
          <ul>
            {(Object.values(country.languages).map(lang => <div key={lang}> <li>{lang}</li> </div> ))}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} />
          </div>)}
        </div>
        : filteredCountries.length > 10 && searchInput.length > 0 ? 
          <p>Too many matches, specify another filter</p> 
          : searchInput.length === 0 ? 
          <div></div> :
          filteredNames.map(country => 
          <div key={country}>
            <li>{country}</li>
          </div>)
      }
    </div>
  )
}

export default App
