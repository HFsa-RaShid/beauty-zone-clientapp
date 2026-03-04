const hero = document.querySelector(".hero");

const images = [
  "assets/slide1.jpg",
  "assets/slide2.jpg",
  "assets/slide3.jpg"
];

let index = 0;

function changeSlide() {
  hero.style.backgroundImage = `url(${images[index]})`;
  index++;

  if (index === images.length) {
    index = 0;
  }
}

changeSlide();
setInterval(changeSlide, 4000);