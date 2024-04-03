import { useState } from 'react'
const Blog = ({ blog, handleAddLike, handleDelete, username }) => {
  const [visible, setVisible] = useState(false)
  const deleteVisible = username === blog.user.name
  const deleteStyle = { display: deleteVisible ? '' : 'none' }

  const Detail = () => {
    if(visible){
      return(
        <div id="detail">
          <p>
            {blog.url}
          </p>
          <p>
            <span id="likes">{blog.likes}</span> <button onClick={handleAddLike} value={blog.id} id="like-button">Like</button>
          </p>
          <p>{blog.user ? blog.user.name : '-'}</p>
                    
          <p style={deleteStyle}><button onClick={handleDelete} value={blog.id}>Delete</button></p>
                    
        </div>
      )
    }
  }

  const toggleDetailVisibility = () => {
    setVisible(!visible)
  }
 
  return(
    <div className="blog">
      {blog.title} {blog.author} <button onClick={toggleDetailVisibility} id="view">View</button>
      <Detail />
    </div>
  )
}


export default Blog