const Course = ({ course }) => {
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

const Header = ({course}) => {
  return (
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}

const Part = ({part, exercise}) => {
  return (
    <div>
      <p>{part} {exercise}</p>
    </div>
  )
}

const Content = ({course}) => {
    return (
      <div>
        <Part part={course.parts[0].name} exercise={course.parts[0].exercises}/>
        <Part part={course.parts[1].name} exercise={course.parts[1].exercises}/>
        <Part part={course.parts[2].name} exercise={course.parts[2].exercises}/>
        <Part part={course.parts[3].name} exercise={course.parts[3].exercises}/>
      </div>
    )
  }

const Total = ({course}) => {
  return (
    <p>Total of {
        course.parts[0].exercises + course.parts[1].exercises + course.parts[2].exercises +
        course.parts[3].exercises
        } exercises
    </p>
  )
}

export default Course