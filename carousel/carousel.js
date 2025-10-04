const slides = document.querySelector('.slides');
const slideItems = document.querySelectorAll('.slides li');
const prevBtn = document.querySelector('.nav.prev');
const nextBtn = document.querySelector('.nav.next');
const markersContainer = document.querySelector('.markers');

let currentIndex = 0;

slideItems.forEach((_, i) => {
  const marker = document.createElement('div');
  marker.className = 'marker';
  marker.textContent =
    i === 0 ? 'First' : i === slideItems.length - 1 ? 'Last' : i + 1;
  marker.addEventListener('click', () => goToSlide(i));
  markersContainer.appendChild(marker);
});

const markers = document.querySelectorAll('.marker');

function updateCarousel() {
  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  markers.forEach((m, i) => m.classList.toggle('active', i === currentIndex));
}

function goToSlide(index) {
  currentIndex = (index + slideItems.length) % slideItems.length;
  updateCarousel();
}

prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

updateCarousel();
