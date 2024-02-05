import { useState } from 'react'

const Statistics = (props) => {
  if(props.total === 0){
    return <p>No feedback given</p>
  }
  return (
    <>
      <h1>Statistics</h1>
      <table>
        <tbody>
        <StatisticsLine text="good" value = {props.good} />      
        <StatisticsLine text="neutral" value = {props.neutral} />
        <StatisticsLine text="bad" value = {props.bad} />
        <StatisticsLine text="All" value = {props.total} />
        <StatisticsLine text="Average" value = {props.average} />
        <StatisticsLine text="Positive" value = {props.positive} postfix="%"/>
        </tbody>
      </table>
    </>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value}{props.postfix}</td></tr>
  )
}

const Button = (props) => {
    return (
      <>
        <button onClick={props.clickEvent}>{props.text}</button> 
      </>
    )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  

  const addGood = () => {
    console.log("Good: ", good)
    const updatedGood = good + 1
    setGood(updatedGood)
    setTotal(updatedGood + neutral + bad)
  }

  const addNeutral = () => {
    console.log("Neutral: ", neutral)
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    setTotal(good + updatedNeutral + bad)
  }

  const addBad = () => {
    console.log("Bad: ", bad)
    const updatedBad = bad + 1
    setBad(updatedBad)
    setTotal(good + neutral + updatedBad)
  }

  const calculateAverage = () => {
    return (good - bad) / total
  }

  const calculatePositive = () => {
    return (good / total) * 100
  }

  return (
    <>     
      <h1>Give feedback</h1>    
      <div>
        <Button clickEvent={addGood} text="Good" /> 
        <Button clickEvent={addNeutral} text="Neutral" />
        <Button clickEvent={addBad} text="Bad" />
      </div>      
      <Statistics good={good} neutral={neutral} bad={bad} total={total} 
        average={calculateAverage()} positive={calculatePositive()} />
    </>
  )
}

export default App
