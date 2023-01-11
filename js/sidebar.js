// Create sidebar dynamically
document.querySelectorAll('h3[id]').forEach((header) => {
    const sidebarLink = createElement(
        `<a href="#${header.id}">${header.innerText.trim()}</a>`
    );
    document.querySelector('.sidebar').append(sidebarLink);

    if (header.nextElementSibling?.classList.contains(`${header.id}-linkable`)) {
        document.querySelectorAll(`.${header.id}-linkable`).forEach((linkable) => {
            const sidebarSubLink = createElement(
                `<a href="#${linkable.id}" class="level-2">${linkable.innerText.trim()}</a>`
            );
            document.querySelector('.sidebar').append(sidebarSubLink);
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

function createElement(htmlTemplate) {
    const template = document.createElement('template');
    htmlTemplate = htmlTemplate.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = htmlTemplate;
    return template.content.firstChild;
}
