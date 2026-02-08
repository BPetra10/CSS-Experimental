// STATES
let gameStarted = false;
let isFallingBack = false;
let gateLimitX = null;
let hasKey = false;
let lockOpened = false;
document.body.style.setProperty('--scroll', 'locked');

// DOM ELEMENTS
const mixText = document.querySelector('.mixText');
const intro = document.querySelector('.intro');
const gateRock = document.querySelector('.gateRock');
const player = document.querySelector('.player');
const rockKeySpace = document.querySelector('.rockKeySpace');
const prize = document.querySelector('.prize');
const riddleInput = document.querySelector('.riddleInput');
const riddlePanel = document.querySelector('.riddlePanel');

const c1 = document.querySelector('.color1');
const c2 = document.querySelector('.color2');
const checkMixBtn = document.querySelector('.checkMixBtn');

// RIDDLE
const correctAnswer = 'graphite';
const correctImage = 'img/ans3.jpg';
const checkAnsBtn = document.querySelector('.checkAnswer');

// TOOLTIP
const tooltip = document.createElement('div');
tooltip.className = 'gateTooltip';
tooltip.textContent = 'Solve to open';
document.body.appendChild(tooltip);

// GATE LIMIT
function measureGateLimit() {
  const r = gateRock.getBoundingClientRect();
  gateLimitX = r.left;
}
measureGateLimit();

// COLOR MIX
function mixHex(h1, h2) {
  const r = (parseInt(h1.slice(1, 3), 16) + parseInt(h2.slice(1, 3), 16)) >> 1;
  const g = (parseInt(h1.slice(3, 5), 16) + parseInt(h2.slice(3, 5), 16)) >> 1;
  const b = (parseInt(h1.slice(5, 7), 16) + parseInt(h2.slice(5, 7), 16)) >> 1;
  return { r, g, b };
}

function previewMix() {
  const { r, g, b } = mixHex(c1.value, c2.value);
  mixText.style.color = `rgb(${r},${g},${b})`;
}
c1.addEventListener('input', previewMix);
c2.addEventListener('input', previewMix);

// CHECK BUTTON FOR MIXING
checkMixBtn.addEventListener('click', () => {
  if (gameStarted) return;

  document.body.style.removeProperty('--mix');

  const { r, g, b } = mixHex(c1.value, c2.value);

  if (r > 200 && g > 150 && g < 210 && b < 90 && r > g) {
    startGame();
  } else {
    requestAnimationFrame(() => {
      document.body.style.setProperty('--mix', 'wrong');
    });
  }
});

// START GAME
function startGame() {
  gameStarted = true;

  document.body.style.removeProperty('--scroll');

  document.startViewTransition(() => {
    gateRock.remove();
    intro.remove();
  });

  tooltip.remove();

  setTimeout(() => {
    generateElements();
    checkCollision();
    resetIdle();
  }, 1015);
}

// ROCKS & KEY
const size = 90;
const rocksKey = [];

const usableWidth = window.innerWidth * 0.93;
const sideMargin = window.innerWidth * 0.05;

const pageHeight = document.body.scrollHeight;
const forbiddenTop = window.innerHeight * 0.5;
const forbiddenBottom = pageHeight - window.innerHeight * 0.7;

function randomCornerShapes() {
  const shapes = ['scoop', 'bevel', 'round', 'notch'];
  const pick = () => shapes[Math.floor(Math.random() * shapes.length)];
  return `${pick()} ${pick()} ${pick()} ${pick()}`;
}

function randomRadius() {
  const r = () => 20 + Math.random() * 50;
  return `${r()}% ${r()}% ${r()}% ${r()}%`;
}

function isOverlapping(x, y) {
  for (const r of rocksKey) {
    const dx = x - r.x;
    const dy = y - r.y;
    if (Math.sqrt(dx * dx + dy * dy) < size) return true;
  }
  return false;
}

function spawnElements(type) {
  let x, y, attempts = 0;

  do {
    x = sideMargin + Math.random() * (usableWidth - size);
    y = forbiddenTop +
      Math.random() * (forbiddenBottom - forbiddenTop - size);
    attempts++;
  } while (isOverlapping(x, y) && attempts < 300);

  rocksKey.push({ x, y, type });

  const el = document.createElement('div');

  if (type === 'rock') {
    el.className = 'rock';
    el.style.cornerShape = randomCornerShapes();
    el.style.borderRadius = randomRadius();
  }

  if (type === 'key') {
    el.className = 'key';
    el.textContent = '\u{1F5DD}\u{FE0F}';
  }

  el.style.left = x + 'px';
  el.style.top = y + 'px';

  rockKeySpace.appendChild(el);
}

function generateElements() {
  for (let i = 0; i < 50; i++) spawnElements('rock');
  spawnElements('key');
}

// PLAYER MOVE
window.addEventListener('mousemove', e => {
  const playerRect = player.getBoundingClientRect();
  const half = playerRect.width / 2;

  let x = e.clientX;

  if (!gameStarted && x + half > gateLimitX) {
    x = gateLimitX - half;
    document.body.style.setProperty('--gateT', 'blocked');
  } else {
    document.body.style.removeProperty('--gateT');
  }

  const percent = x / window.innerWidth;
  const clamped = Math.max(0.05, Math.min(0.95, percent));
  player.style.left = clamped * 100 + 'vw';
});

// EMOJI TRANSITIONS
function swapToSad() {
  document.startViewTransition(() => {
    document.body.style.setProperty('--mood', 'sad');
  });
}

function swapToHappy() {
  document.startViewTransition(() => {
    document.body.style.removeProperty('--mood');
  });
}

// FALL BACK FOR COLLIDE
function fallBack() {
  if (isFallingBack) return;
  isFallingBack = true;

  swapToSad();

  const fallDistance = window.innerHeight * 0.6;
  const start = window.scrollY;
  const target = Math.max(0, start - fallDistance);

  window.scrollTo({ top: target, behavior: 'smooth' });

  const waitStop = setInterval(() => {
    if (Math.abs(window.scrollY - target) < 2) {
      clearInterval(waitStop);
      setTimeout(() => {
        swapToHappy();
        isFallingBack = false;
      }, 300);
    }
  }, 50);
}

// COLLISION
function checkCollision() {
  const p = player.getBoundingClientRect();
  const px = p.left + p.width / 2;
  const py = p.top + p.height / 2;

  const scrollY = window.scrollY;

  for (const obj of rocksKey) {
    const rx = obj.x + size / 2;
    const ry = obj.y - scrollY + size / 2;
    const objRadius = size * 0.6;
    const playerRad = 20;

    const dx = px - rx;
    const dy = py - ry;

    if (Math.sqrt(dx * dx + dy * dy) < playerRad + objRadius) {

      if (obj.type === 'rock') {
        fallBack();
      }

      if (obj.type === 'key' && !hasKey) {
        const keyEl = rockKeySpace.querySelector('.key');
        keyEl?.remove();

        rocksKey.splice(rocksKey.indexOf(obj), 1);

        hasKey = true;

        document.startViewTransition(() => {
          document.body.style.setProperty('--player', 'hasKey');
        });
      }
    }
  }
  requestAnimationFrame(checkCollision);

  // PRIZE SIMPLE BOX COLLISION
  const prizeRect = prize.getBoundingClientRect();

  const touching =
    p.right > prizeRect.left &&
    p.left < prizeRect.right &&
    p.bottom > prizeRect.top &&
    p.top < prizeRect.bottom;

  if (touching && hasKey && !lockOpened) {
    lockOpened = true;
    rockKeySpace.remove();

    document.startViewTransition(() => {
      document.body.style.setProperty('--lock', 'open');
    });

    document.body.style.setProperty('--scroll', 'locked');
  }

}

//IMAGE SELECT
let selectedImage = null;

const carousel = document.querySelector('.carousel');
const items = carousel.querySelectorAll('li');

function updateSelectedImage() {
  const itemHeight = carousel.clientHeight;
  const index = Math.round(carousel.scrollTop / itemHeight);

  const currentLi = items[index];
  if (!currentLi) return;

  const img = currentLi.querySelector('img');
  selectedImage = img.getAttribute('src');
}

carousel.addEventListener('scroll', updateSelectedImage);

//RIDDLE ANSWER CHECK
function checkRiddleAnswer() {
  const inputValue = riddleInput.value.trim().toLowerCase();

  document.body.style.removeProperty('--answer');

  const inputOk = inputValue === correctAnswer;
  const imageOk = selectedImage === correctImage;

  requestAnimationFrame(() => {
    if (!inputOk && !imageOk) {
      document.body.style.setProperty('--answer', 'wrongBoth');
    } else if (!inputOk) {
      document.body.style.setProperty('--answer', 'wrongInput');
    } else if (!imageOk) {
      document.body.style.setProperty('--answer', 'wrongImage');
    } else {
      document.body.style.removeProperty('--player');
      prize.remove();
      riddlePanel.remove();
      document.body.style.setProperty('--answer', 'good');
      setTimeout(() => {
        document.startViewTransition(() => {
          location.href = "congrats.html";
        });
      }, 3000);
    }
  });
}

// SWAP TO CONGRATS PAGE
window.addEventListener('pageswap', (event) => {
  if (event.viewTransition) {
    if (lockOpened) { 
        event.viewTransition.types.add('lift');
    }
  }
});

// CHECK BUTTON FOR RIDDLE
checkAnsBtn.addEventListener('click', () => {
  checkRiddleAnswer();
});

// AUTO SCROLL
let idleTimer = null;
let autoScrolling = false;

function canScrollDown() {
  return window.scrollY + window.innerHeight < document.body.scrollHeight - 2;
}

function startAutoScroll() {
  if (autoScrolling || !gameStarted) return;
  autoScrolling = true;

  function step() {
    if (!autoScrolling) return;
    if (!canScrollDown()) {
      autoScrolling = false;
      return;
    }

    window.scrollTo({
      top: window.scrollY + window.innerHeight * 0.8,
      behavior: 'smooth'
    });

    setTimeout(step, 900);
  }

  step();
}

function resetIdle() {
  if (!gameStarted) return;

  clearTimeout(idleTimer);
  autoScrolling = false;

  idleTimer = setTimeout(startAutoScroll, 3000);
}

['wheel', 'touchstart', 'keydown', 'mousemove']
  .forEach(evt => window.addEventListener(evt, resetIdle, { passive: true }));
