const ranges = document.querySelectorAll('.ranges input[type="range"]');
const shapeSelect = document.getElementById('corner-shape');
const randomizeButton = document.querySelector('.randomize');
const shape = document.querySelector('.shape');
const cssCodeDiv = document.querySelector('.cssCode');

function setCornerShapeAndValue() {
    const cornerValues = [];
    ranges.forEach(range => {
        const corner = range.dataset.corner;
        const value = range.value + "%";

        cornerValues.push(value);

        shape.style.setProperty(`--${corner}`, value);
    });

    const cornerType = shapeSelect.value;
    let cssCodeSnippet = '';
    const tl = cornerValues[0];
    const tr = cornerValues[1];
    const br = cornerValues[2];
    const bl = cornerValues[3];

    cssCodeSnippet = `border-radius: ${tl} ${tr} ${br} ${bl};<br>corner-shape: ${cornerType};`;

    shape.style.setProperty('--corner-shape', cornerType);

    cssCodeDiv.innerHTML = cssCodeSnippet;
}

ranges.forEach(range => range.addEventListener('input', setCornerShapeAndValue));
shapeSelect.addEventListener('change', setCornerShapeAndValue);

randomizeButton.addEventListener('click', () => {
    ranges.forEach(range => {
        range.value = Math.round(Math.random() * 50);
    });

    shapeSelect.selectedIndex = Math.floor(Math.random() * shapeSelect.options.length);

    setCornerShapeAndValue();

    shape.style.backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 60%, 50%)`;
});

setCornerShapeAndValue();