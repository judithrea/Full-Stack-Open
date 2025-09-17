import { useState } from 'react'
// Button component
const Button = ({onClick, text}) => 
  <button onClick={onClick}>{text}</button>

// Statistics component
const Statistics = ({text, clicks}) => 
  <p>{text} {clicks}</p>

const App = () => {
  // text of buttons and statistics
  const goodText = 'good'
  const neutralText = 'neutral'
  const badText = 'bad'

  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // handle clicks of each button
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
      <Button onClick={handleGoodClick} text={goodText} />
      <Button onClick={handleNeutralClick} text={neutralText} />
      <Button onClick={handleBadClick} text={badText} />

      <h1>Statistics</h1>
      <Statistics text={goodText} clicks={good} />
      <Statistics text={neutralText} clicks={neutral} />
      <Statistics text={badText} clicks={bad} />

    </div>
  )
}

export default App