const { test, describe } = require('node:test')
const assert = require('node:assert')
const dummy = require('../utils/list_helper').dummy
const totalLikes = require('../utils/list_helper').totalLikes
const testblogs = require('../utils/list_helper').biggerblogs
const oneTestBlog = require('../utils/list_helper').listWithOneBlog

test('dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)  
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes([])
        assert.strictEqual(result, 0)        
    })
    
    test('when list has only one blog equals the likes of that', () => {
      const result =  totalLikes(oneTestBlog)
      assert.strictEqual(result, 5)
    })

    test('of a bigger list is calculated right', () => {
      const result = totalLikes(testblogs)
      assert.strictEqual(result, 36)
    })
})
