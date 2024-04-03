/* eslint-disable react/display-name */
import { useState, useImperativeHandle, forwardRef } from 'react'

const BlogForm = forwardRef(({ onSubmit }, ref) => {
  const [titleValue, setTitleValue] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [url, setUrl] = useState('')
  const onTitleChange = (event) => {
    setTitleValue(event.target.value)
  }
  const onAuthorChange = (event) => {
    setAuthorName(event.target.value)
  }
  const onUrlChange= (event) => {
    setUrl(event.target.value)
  }
  useImperativeHandle(ref, () => {
    return titleValue
  })
  return(
    <form onSubmit={onSubmit}>
      <div>
        Title:
        <input type="text"
          value={titleValue}
          name="title"
          id="title"
          onChange={onTitleChange} />
      </div>
      <div>
          Author:
        <input type="text"
          value={authorName}
          name="authorName"
          id="authorName"
          onChange={onAuthorChange} />
      </div>
      <div>
          Url:
        <input type="text"
          value={url}
          name="url"
          id="url"
          onChange={onUrlChange} />
      </div>
      <button type="submit" id="create-button">Create</button>
    </form>
  )
})
export default BlogForm