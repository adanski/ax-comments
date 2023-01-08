import $ from 'cash-dom';

// Create sidebar dynamically
document.querySelectorAll('h3[id]').forEach((header) => {
    const sidebarLink = $(`<a href="#${header.id}">${header.innerText}</a>`);
    document.querySelector('.sidebar').append(sidebarLink[0]);

    if (header.nextElementSibling?.classList.contains(`${header.id}-linkable`)) {
        document.querySelectorAll(`.${header.id}-linkable`).forEach((linkable) => {
            const sidebarSubLink = $(`<a href="#${linkable.id}" class="level-2">${linkable.innerText}</a>`);
            document.querySelector('.sidebar').append(sidebarSubLink[0]);
        });
    }
});

// Animate scrolling into sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
