describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:8000'); // change URL to match your dev URL
    cy.get('#username').type('admin');
    cy.get('#password').type('12345');
  });
});
