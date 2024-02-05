const Header = (props) => { 
  return ( 
    <h1>{props.value}</h1>
  )
}

const Part = (props) => {  
  return (
    <p>{props.part.name} {props.part.amount}</p>
  )
}

const Content = (props) => {   
  return (
    <div>
      <Part part={props.parts[0]}/>
      <Part part={props.parts[1]}/>
      <Part part={props.parts[2]}/>
    </div>
  )
}

const Total = (props) => {  
  let total = 0
  props.total.forEach(value => {
    console.log(value)  
    total += value.amount
  })   
  return (
    <p>Total number of excercises: {total}</p>
  )
  }

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React', 
        amount: 10
      },
      {
        name: 'Using props to pass data',
        amount: 7
      },
      {
        name: 'State of a component',
        amount: 14
      }
    ]
  }

  return (    
    <div>
      <Header value={course.name} />
      <Content parts={course.parts} />
      <Total total={course.parts} />
    </div>
  )
}

export default App
