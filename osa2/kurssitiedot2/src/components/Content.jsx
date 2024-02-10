import Part from './Part'

const Total = ({parts}) => {
  const exercises = parts.map(part => part.exercises)
  const totalExercises = exercises.reduce((sum, exerciseAmount) => sum + exerciseAmount, 0)
  return (
    <p>Total of {totalExercises} exercises</p>
  )
}
const Content = ({parts}) => {
    return (
      <>
      <ul style={{listStyle: "none"}}>
        {parts.map((part) => 
          <Part key={part.id} part={part} />
        )}      
      </ul>
      <Total parts={parts} />
      </>
    )
  }
  export default Content