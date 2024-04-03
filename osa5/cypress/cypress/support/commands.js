// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
 Cypress.Commands.add('login', (username, password) => { 
  cy.request({
    method: 'POST', 
    url: 'http://localhost:3003/api/login',
    body: {
      username: username, 
      password: password
    }, 
    failOnStatusCode: false,
  }).then((response) => { 
      localStorage.clear()    
      localStorage.setItem('loggedappUser', JSON.stringify(response.body))  
      cy.visit('') 
  })
})

Cypress.Commands.add('createBlog', ( title, author, url ) => {
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: { 
      title: title, 
      author: author, 
      url: url 
    },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedappUser')).token}`
    }
  })

  cy.visit('')
})
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
