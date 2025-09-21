let myCards = null;

function shuffleMasonry() {
  const masonry = document.getElementById("masonry");

  if (!myCards) {
    myCards = Array.from(masonry.children).map(el => el.outerHTML);
  }

  masonry.innerHTML = "";

  let cards = [];
  for (let i = 0; i < 3; i++) {
    cards = cards.concat(myCards);
  }

  cards.sort(() => Math.random() - 0.5);

  masonry.innerHTML = cards.join("");

  resizeAll();
}


function resizeMasonryItem(item) {
  const grid = document.querySelector('.masonry');
  const rowHeight = parseInt(getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  const gap = parseInt(getComputedStyle(grid).getPropertyValue('gap'));
  const imgHeight = item.querySelector('img').getBoundingClientRect().height;
  const rowSpan = Math.ceil((imgHeight + gap) / (rowHeight + gap));
  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAll() {
  document.querySelectorAll('.masonry .card').forEach(resizeMasonryItem);
}

window.addEventListener("load", () => {
  shuffleMasonry();
});

window.addEventListener("resize", resizeAll);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("shuffle").addEventListener("click", shuffleMasonry);
});
