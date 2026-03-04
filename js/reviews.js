document.addEventListener("DOMContentLoaded", () => {
  const reviewSlider = document.getElementById("review-slider");
  let currentIndex = 0;
  let allReviews = [];

  async function fetchReviews() {
    try {
      const response = await fetch(
        "https://beautyzone-server.vercel.app/api/reviews",
      );
      allReviews = await response.json();

      if (allReviews && allReviews.length > 0) {
        initSlider();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function initSlider() {
    reviewSlider.innerHTML = `<div class="slider-track" id="slider-track"></div>`;
    const track = document.getElementById("slider-track");

    track.innerHTML = allReviews
      .map(
        (review) => `
            <div class="review-card">
                <img src="${review.image}" alt="${review.name}" class="user-img">
                <div class="review-info">
                    <div class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(review.rating)}</div>
                    <p>"${review.comment}"</p>
                    <h4>${review.name}</h4>
                </div>
            </div>
        `,
      )
      .join("");

    startAutoSlide(track);
  }

  function startAutoSlide(track) {
    setInterval(() => {
      currentIndex += 2;

      if (currentIndex >= allReviews.length) {
        currentIndex = 0;
      }

      const cardWidth = document.querySelector(".review-card").offsetWidth + 40;
      const moveX = -(currentIndex * cardWidth);

      track.style.transform = `translateX(${moveX}px)`;

      updateDots(currentIndex);
    }, 4000);
  }

  function updateDots(index) {
    const dots = document.querySelectorAll(".dot");
    const activeDot = Math.floor(index / (allReviews.length / 3));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDot);
    });
  }

  fetchReviews();
});
