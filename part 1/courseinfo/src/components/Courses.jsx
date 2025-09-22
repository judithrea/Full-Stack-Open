const Courses = ({ courses }) => {
  return (
    <div>
      {courses.map(course => 
      <div key={course.id}>
        <Header name={course.name}/>
        <Content parts={course.parts}/>
        <Total parts={course.parts}/>
      </div>
      )}
    </div>
  )
}

const Header = ({name}) => {
  return (
    <div>
      <h2>{name}</h2>
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

const Content = ({parts}) => {
    return (
      <div>
        {parts.map(part => 
          <div key={part.id}>
            <Part part={part.name} exercise={part.exercises}/>
          </div>
        )}
      </div>
    )
  }

const Total = ({parts}) => {
    const exercises = parts.map(obj => obj.exercises)
    const total = exercises.reduce((sum, num) => sum + num, 0)
  return (
    <b>Total of {total} exercises</b>
  )
}

export default Courses