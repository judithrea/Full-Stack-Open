import { useState } from 'react'

// Button component
const Button = ({onClick, text}) => 
  <button onClick={onClick}>{text}</button>

// StatisticLine component
const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  ) 
}
  
// Statistics component
const Statistics = ({good, neutral, bad}) => {
  // Statistics with extra calculations
  const total = good + neutral + bad
  const average = (good - bad) / total
  const positive = (good / total) * 100

  return(
    <div>
      {/* Display statistics if there's feedback data */}
      {total > 0? (
        <table>
          <tbody>
            <StatisticLine text='good' value ={good} />
            <StatisticLine text='neutral' value ={neutral} />
            <StatisticLine text='bad' value ={bad} />
            <StatisticLine text='total' value={total} />
            <StatisticLine text='average' value={total === 0? 0: average} />
            <StatisticLine text='positive' value={total === 0? `${0} %`: `${positive} %`} />
          </tbody>
        </table>
        ) : (
        <p>No feedback given</p>
        )
      }
    </div>
  )
}

const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // Handle clicks of each button
  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
  }
  
  return (
    <div>
      <h1>Give Feedback</h1>
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>

      <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App