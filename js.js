// Scroll fade
window.addEventListener("scroll", () => {
  const elements = document.querySelectorAll(".card, .problem-card, .testimonial");
  elements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if(position < window.innerHeight - 100){
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});