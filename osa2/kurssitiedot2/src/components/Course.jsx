import Header from './Header'
import Content from './Content'

const Course = ({course}) => {
  return(
    <>
     <ul style={{listStyle: "none"}}>
        {course.map((course) => 
           <>
          <Header value={course.name} />
          <Content parts={course.parts} />
          </>
        )}      
      </ul>
    
    </>
  )
}

export default Course