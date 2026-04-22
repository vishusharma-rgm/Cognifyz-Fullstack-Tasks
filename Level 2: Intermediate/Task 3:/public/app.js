document.addEventListener("DOMContentLoaded", function () {
  const timelineSections = document.querySelectorAll(".timeline-section");
  const revealCards = document.querySelectorAll(".reveal-card");

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("timeline-visible");
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  const cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  timelineSections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  revealCards.forEach(function (card) {
    cardObserver.observe(card);
  });
});
