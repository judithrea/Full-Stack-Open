import { use, useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [countryWeather, setCountryWeather] = useState([])

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

   useEffect(() => {
    axios
      .get(baseUrl)
      .then(res => {
        setAllCountries(res.data)
      })
  }, [])
  
  const filteredCountries = allCountries.filter(country => 
    country.name.common.toLowerCase().includes(searchInput.toLowerCase()))
  
  const filteredNames = filteredCountries.map(country => country.name.common)

  const country = filteredCountries.length === 1 ? 
   filteredCountries[0].name.common : null

  const handleInputChange = (event) => {
    setSearchInput(event.target.value)
    
  }

  const handleShowCountry = (name) => {
    document.getElementById('countriesInput').value = name
    setSearchInput(name)
  }

  useEffect(() => {
      if (filteredCountries.length === 1) {
      const latitude = filteredCountries[0].capitalInfo.latlng[0]
      const longitude = filteredCountries[0].capitalInfo.latlng[1]
      
      axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`)
        .then(res => 
          setCountryWeather(res.data),
        )
      }
  }, [country])

  return (
    <div>
      find countries <input onChange={handleInputChange} type="text" id="countriesInput" />
      
      {filteredCountries.length === 1 ? 
        <div>
          <h1>{filteredNames}</h1>
          {filteredCountries.map(country => 
          <div key={country.name}>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
              {(Object.values(country.languages).map(lang => <div key={lang}> <li>{lang}</li> </div> ))}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <div>
              <h1>Weather in {country.capital}</h1>
              {countryWeather && countryWeather.current && 
              <div>
                <p>Temperature {countryWeather.current.temperature_2m} {countryWeather.current_units.temperature_2m}</p>
                <p>Wind {countryWeather.current.wind_speed_10m} {countryWeather.current_units.wind_speed_10m}</p>
              </div>}
            </div>
          </div>)}
        </div>
      
        : filteredCountries.length > 10 && searchInput.length > 0 ? 
          <p>Too many matches, narrow down your search</p> 
          : searchInput.length === 0 ? 
          <div></div> :

        filteredNames.map(country => 
        <div key={country}>
          <li>{country} <button onClick={() => handleShowCountry(country)}>show</button> </li>
        </div>)
      } 
    </div>
  )
}

export default App
