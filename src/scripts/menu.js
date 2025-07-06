// Function to attach hamburger menu functionality
function attachHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        // Remove existing event listeners to prevent duplicates
        hamburger.removeEventListener('click', toggleMenu);
        // Add new event listener
        hamburger.addEventListener('click', toggleMenu);
    }
}

// Function to toggle the menu
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.classList.toggle('expanded');
    navLinks?.classList.toggle('expanded');
}

// Attach menu functionality on initial load
attachHamburgerMenu();

// Re-attach menu functionality after ViewTransitions
document.addEventListener('astro:page-load', attachHamburgerMenu);