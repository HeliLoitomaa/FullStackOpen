
const Persons = ({persons, clickHandler}) => {  
    return (
        <ul style={{listStyle: "none"}}>
            {persons.map(person => 
            <li className='phperson' key={person.name}>
                {person.name} {person.phone} 
                <button onClick={clickHandler} value={person.id}>Delete</button>
            </li>)}
        </ul>
    )
}
export default Persons
