import $ from 'cash-dom';

// Create sidebar dynamically
document.querySelectorAll('h3').forEach((el, index) => {
    const headerAnchor = el.querySelector('a[id]');
    const id = headerAnchor.id;
    const listEl = $(`<a href="#${id}">${el.innerText}</a>`);
    document.querySelector('.sidebar').append(listEl[0]);

    if (el.nextElementSibling?.tagName.toLowerCase() === 'table') {
        const table = el.nextElementSibling;
        table.querySelectorAll('th').forEach((th, index) => {
            const subId = `${id}-${index + 1}`;
            th.id = subId;

            const listSubEl = $(`<a href="#${subId}" class="level-2">${th.innerText}</a>`);
            document.querySelector('.sidebar').append(listSubEl[0]);
        });
    }
});
