import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import PropTypes from 'prop-types'

const App = () => {
  const [info, setInfo] = useState({ message: null })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect( () => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('useeffect setuser')
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, type='info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null } )
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem(
        'loggedappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('ex', exception)
      notifyWith('wrong credentials', 'error')
      setUsername('')
      setPassword('')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedappUser')
  }

  const handleAddBlog = async(event) => {
    event.preventDefault()
    const newBlog = { title: event.target.title.value, author: event.target.authorName.value, url: event.target.url.value, user: user }
    console.log('addBlog', newBlog)
    const response = await blogService.create(newBlog)
    setBlogs(blogs.concat(response))
    blogFormRef.current.toggleVisibility()
    const title = titleRef.current
    notifyWith(`A new blog ${title} was added`)
  }

  const handleAddLike = async(event) => {
    const blog = blogs.find((blog) => blog.id === event.target.value)
    await blogService.addLike(blog)
    blogService.getAll().then(blogs => setBlogs(blogs))

  }

  const handleDelete = async(event) => {
    event.preventDefault()
    const blog = await blogService.getItem(event.target.value)
    if(window.confirm(`Remove blog ${blog.title}?`)){
      await blogService.deleteWithId(event.target.value)
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>blogs</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          id="username"
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          id="password"
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
  )
  loginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
  }

  const blogFormRef = useRef()
  const titleRef = useRef()

  const blogsPanel = () => (

    <div>
      <h2>Blogs</h2>
      <p id='user'>{`${user.name} logged in`} <button onClick={handleLogout}>logout</button></p>
      {
        blogs.toSorted((blogA, blogB) => {
          if (blogB.likes < blogA.likes) {
            return -1
          } else if (blogB.likes > blogA.likes) {
            return 1
          }}).map(blog =>
          <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} handleDelete={handleDelete} username={user.name}/>)
      }
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <h3>Create new</h3>
        <BlogForm onSubmit = {handleAddBlog} ref={titleRef} />
      </Togglable>


    </div>

  )


  return (
    <div>
      <Notification info={info} />
      {!user && loginForm() }
      { user && blogsPanel() }
    </div>
  )
}

export default App