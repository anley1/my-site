document.querySelector('.hamburger')?.addEventListener('click', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.classList.toggle('expanded');
    navLinks?.classList.toggle('expanded');
})