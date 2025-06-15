const slider = document.getElementById('slider');
const dotsContainer = document.getElementById('dots');
const slides = document.querySelectorAll('.slide');
let slideIndex = 0;
let interval;

function createDots() {
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => {
      slideIndex = i;
      showSlide(slideIndex);
    };
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
  document.querySelectorAll('.dot')[slideIndex].classList.add('active');
}

function showSlide(index) {
  if (index >= slides.length) slideIndex = 0;
  if (index < 0) slideIndex = slides.length - 1;
  slider.style.transform = `translateX(${-slideIndex * 100}%)`;
  updateDots();
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

function startAutoSlide() {
  interval = setInterval(() => nextSlide(), 4000);
}

function stopAutoSlide() {
  clearInterval(interval);
}

document.getElementById('sliderContainer').addEventListener('mouseenter', stopAutoSlide);
document.getElementById('sliderContainer').addEventListener('mouseleave', startAutoSlide);

let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) nextSlide();
  if (touchEndX > touchStartX + 50) prevSlide();
});

createDots();
startAutoSlide();

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const icon = document.getElementById("themeIcon");
  if (body.classList.contains("dark-mode")) {
    icon.src = "https://cdn-icons-png.flaticon.com/512/1164/1164954.png";
  } else {
    icon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
  }
}

function toggleMenu() {
  document.getElementById("navMenu").classList.toggle("active");
}

document.getElementById("healthForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const resultDiv = document.getElementById("resultBox");
  resultDiv.innerHTML = "Processing... Please wait.";
  resultDiv.style.display = "block";

  const data = {
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    heartRate: document.getElementById("heartRate").value,
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    history: document.getElementById("history").value,
    symptoms: document.getElementById("symptoms").value
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.analysis) {
      resultDiv.innerHTML = `<h3>AI Health Analysis:</h3><p>${result.analysis}</p>`;
    } else {
      resultDiv.innerHTML = `<h3>Error:</h3><p>${result.error || "Something went wrong."}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<h3>Connection Error</h3><p>Unable to connect to the backend.</p>`;
  }
});
