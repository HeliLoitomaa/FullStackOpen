const Notification = ({message, error}) => {
    let stylename = 'notification'
    if(message === ''){
      return null
    }
    if(error){
        stylename = 'error'
    }
    return (
      <div className={stylename}>
        {message}
      </div>
    )
  }
  export default Notification