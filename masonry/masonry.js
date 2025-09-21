if (CSS && CSS.supports) {
  const ok = CSS.supports('display', 'masonry') || CSS.supports('grid-template-rows', 'masonry');
  console.log('Masonry supported:', ok);
}

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
}

document.addEventListener("DOMContentLoaded", shuffleMasonry);

document.getElementById("shuffle").addEventListener("click", shuffleMasonry);