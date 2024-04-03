describe('Blog spec', function()  {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Heli Loitomaa',
        username: 'hloi',
        password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    const user2= {
      name: 'Matti Luukkainen',
        username: 'mluuk',
        password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('')
  })  

  describe('Login',function() {
    beforeEach(function() {
      cy.visit('')
    })

    it('Login form is shown', function() {     
      cy.contains('blogs')
      cy.contains('login')
    })

    it('succeeds with correct credentials', function() {
      cy.login('hloi', 'salainen')
      cy.contains('Heli Loitomaa logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('wrong credentials')
      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('Blog app', function() {   
  
    describe('When logged in', function() {
      beforeEach(function () {
        cy.login('hloi', 'salainen')
      })
  
      it('A blog can be created', function() {
        cy.createBlog('Title1','Authorname1','Url1')
        cy.get('.blog').contains('Title1').contains('View')
      })

      it('A blog can be liked', function() {
        cy.createBlog('Title2','Authorname2','Url2')        
        cy.contains('Title2').contains('View').as('viewbutton2')
        cy.get('@viewbutton2').click()
        cy.contains('Title2').find('#likes').as('likes2')
        cy.get('@likes2').contains('0')
        cy.contains('Title2').find('#like-button').as('likebutton2')
        cy.get('@likebutton2').click()
        cy.get('@likes2', { timeout: 10000 }).contains('1')
      })

      it('Delete button visible to blog creator and blog can be deleted', function() {
        cy.createBlog('Title1','Authorname1','Url1')
        cy.get('.blog').contains('Title1').contains('View').as('viewbutton')
        cy.get('@viewbutton').click()
        cy.contains('Delete').as('deletebutton')
        cy.get('@deletebutton').click()
        cy.get('Title1').should('not.exist')
      })

      it('Delete button visible to blog creator only', function() {
        cy.createBlog('Title1','Authorname1','Url1')   
        cy.get('[id=user]').contains('logout').click()  
        cy.login('mluuk', 'salainen')
        cy.get('.blog').contains('Title1').contains('View').as('viewbutton')
        cy.get('@viewbutton').click()
        cy.get('.blog').contains('Delete').should('not.be.visible')
      })

      it('Blogs are ordered by likes ', function() {
        cy.createBlog('Medium likes','Authorname3','Url3')
        cy.createBlog('Least likes','Authorname1','Url1')
        cy.createBlog('Most likes','Authorname2','Url2')   

        cy.contains('Least likes').contains('View').click()

        cy.contains('Medium likes').as('mediumlikesblog')
        cy.contains('Medium likes').contains('View').as('mediumviewbutton')
        cy.get('@mediumviewbutton').click()
        cy.contains('Medium likes').find('#likes').as('likesmedium')
        cy.contains('Medium likes').find('#like-button').as('likebuttonmedium')
        cy.get('@likebuttonmedium').click()
        cy.get('@likesmedium', { timeout: 10000 }).contains('1')

        cy.contains('Most likes').contains('View').as('mostviewbutton')
        cy.get('@mostviewbutton').click()
        cy.contains('Most likes').find('#likes').as('likesmost')
        cy.contains('Most likes').find('#like-button').as('likebuttonmost')
        cy.get('@likebuttonmost').click()
        cy.get('@likesmost', { timeout: 10000 }).contains('1')
        cy.get('@likebuttonmost').click()
        cy.get('@likesmost', { timeout: 10000 }).contains('2')

        cy.get('.blog').eq(0).should('contain', 'Most likes')
        cy.get('.blog').eq(1).should('contain', 'Medium likes')
        cy.get('.blog').eq(2).should('contain', 'Least likes')
      })
    })
  
  })


})