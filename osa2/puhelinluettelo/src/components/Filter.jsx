const Filter = ({value, handleFilter}) => {
    return(
        <div>Filter shown with: <input value={value} onChange={handleFilter}/></div>
    )
    
}
export default Filter
