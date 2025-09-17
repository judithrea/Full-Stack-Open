import { useState } from 'react'
// Button component
const Button = ({onClick, text}) => 
  <button onClick={onClick}>{text}</button>

// StatisticLine component
const StatisticLine = ({text, value}) => 
  <p>{text} {value}</p>

// Statistics component
const Statistics = ({good, neutral, bad, statsTotal, statsAverage, positivePercentage}) => {
  return(
    <div>
      {/* Only display statistics if there's feedback data */}
      {statsTotal > 0? (
        <div>
          <StatisticLine text='good' value ={good} />
          <StatisticLine text='neutral' value ={neutral} />
          <StatisticLine text='bad' value ={bad} />
          <StatisticLine text='total' value={statsTotal} />
          <StatisticLine text='average' value={statsTotal === 0? 0: statsAverage} />
          <StatisticLine text='positive' value={statsTotal === 0? `${0} %`: `${positivePercentage} %`} />
        </div>
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

  // Statistics with extra calculations
  const statsTotal = good + neutral + bad
  const statsAverage = (good - bad) / statsTotal
  const positivePercentage = (good / statsTotal) * 100
   

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
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />

      <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} statsTotal={statsTotal} statsAverage={statsAverage} positivePercentage={positivePercentage}/>
    </div>
  )
}

export default App