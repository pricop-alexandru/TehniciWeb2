document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav > ul');
    const submenus = document.querySelectorAll('nav ul ul');

    hamburger.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('nav > ul > li > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if(window.innerWidth <= 768) {
                e.preventDefault();
                const sub = e.target.nextElementSibling;
                sub.classList.toggle('open');
            }
        });
    });
});