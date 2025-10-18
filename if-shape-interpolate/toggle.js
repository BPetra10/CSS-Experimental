const themeToggle = document.getElementById('toggle');
const body = document.body;
const DARK_MODE_CLASS = 'darkmode'; 

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.add(DARK_MODE_CLASS);
    } else {
        body.removeAttribute('class');
    }
});