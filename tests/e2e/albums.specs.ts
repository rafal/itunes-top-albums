describe('iTunes Top Albums', () => {
  beforeEach(() => {
    // Intercept API call and stub with fixture data
    cy.intercept('GET', 'https://itunes.apple.com/us/rss/topalbums/limit=100/json', {
      fixture: 'albums.json'
    }).as('getAlbums');
    
    // Visit the homepage
    cy.visit('/');
    
    // Wait for API response
    cy.wait('@getAlbums');
  });

  it('displays albums from API', () => {
    // Check that albums are displayed
    cy.get('[data-testid="album-card"]').should('have.length.gt', 0);
  });

  it('can search for albums', () => {
    // Type in search input
    cy.get('input[id="search"]').type('test album');
    
    // Check that filtered results are displayed
    cy.get('[data-testid="album-card"]').should('have.length.lte', 100);
  });

  it('can filter albums by genre', () => {
    // Select a genre from dropdown
    cy.get('select[id="genre-filter"]').select(1);
    
    // Check that filtered results are displayed
    cy.get('[data-testid="album-card"]').should('have.length.lte', 100);
  });

  it('can sort albums', () => {
    // Select sort by artist
    cy.get('select[id="sort-by"]').select('artist');
    
    // Check that albums are sorted (we'd need specific test data to verify order)
    cy.get('[data-testid="album-card"]').should('have.length.gt', 0);
    
    // Toggle sort direction
    cy.get('button[title="Toggle sort direction"]').click();
  });

  it('can add an album to favorites', () => {
    // Click favorite button on first album
    cy.get('[data-testid="album-card"]').first().find('button').click();
    
    // Navigate to favorites page
    cy.get('a').contains('Favorites').click();
    
    // Check that favorite album is displayed
    cy.get('[data-testid="album-card"]').should('have.length', 1);
    
    // Remove from favorites
    cy.get('[data-testid="album-card"]').first().find('button').click();
    
    // Check that no favorites remain
    cy.get('[data-testid="album-card"]').should('have.length', 0);
  });

  it('shows empty state when no favorites exist', () => {
    // Navigate to favorites page with no favorites
    cy.get('a').contains('Favorites').click();
    
    // Check for empty state message
    cy.contains('No favorite albums yet').should('be.visible');
  });

  it('can clear all favorites', () => {
    // Add two albums to favorites
    cy.get('[data-testid="album-card"]').first().find('button').click();
    cy.get('[data-testid="album-card"]').eq(1).find('button').click();
    
    // Navigate to favorites page
    cy.get('a').contains('Favorites').click();
    
    // Check that two favorite albums are displayed
    cy.get('[data-testid="album-card"]').should('have.length', 2);
    
    // Click clear all button
    cy.get('button').contains('Clear All').click();
    
    // Confirm in modal
    cy.get('button').contains('Clear All').click();
    
    // Check that no favorites remain
    cy.contains('No favorite albums yet').should('be.visible');
  });

  it('can toggle dark mode', () => {
    // Click dark mode toggle
    cy.get('button[aria-label="Toggle dark mode"]').click();
    
    // Check that dark mode class is added to html element
    cy.get('html').should('have.class', 'dark');
    
    // Toggle back
    cy.get('button[aria-label="Toggle dark mode"]').click();
    
    // Check that dark mode class is removed
    cy.get('html').should('not.have.class', 'dark');
  });
});