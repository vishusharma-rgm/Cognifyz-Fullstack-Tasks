document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll("[data-reveal]");
  const timelineWrappers = document.querySelectorAll(".timeline-wrapper");
  const heroParallax = document.querySelector(".hero-parallax");
  const contactForm = document.getElementById("contactForm");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
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

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });

    const timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          }
        });
      },
      {
        threshold: 0.2
      }
    );

    timelineWrappers.forEach(function (timeline) {
      timelineObserver.observe(timeline);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });

    timelineWrappers.forEach(function (timeline) {
      timeline.classList.add("is-active");
    });
  }

  if (heroParallax) {
    window.addEventListener("scroll", function () {
      const offset = Math.min(window.scrollY * 0.12, 36);
      heroParallax.style.transform = "translateY(" + offset + "px)";
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const fields = {
        contactName: document.getElementById("contactName"),
        contactEmail: document.getElementById("contactEmail"),
        contactSubject: document.getElementById("contactSubject"),
        contactMessage: document.getElementById("contactMessage")
      };
      const errors = {};

      if (fields.contactName.value.trim().length < 3) {
        errors.contactName = "Please enter your full name.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.contactEmail.value.trim())) {
        errors.contactEmail = "Please enter a valid email address.";
      }

      if (fields.contactSubject.value.trim().length < 3) {
        errors.contactSubject = "Please enter a subject.";
      }

      if (fields.contactMessage.value.trim().length < 10) {
        errors.contactMessage = "Please enter a message with at least 10 characters.";
      }

      Object.keys(fields).forEach(function (fieldName) {
        const errorNode = document.querySelector('[data-error="' + fieldName + '"]');
        if (errorNode) {
          errorNode.textContent = errors[fieldName] || "";
        }
      });

      const successNode = document.getElementById("contactSuccess");

      if (Object.keys(errors).length > 0) {
        successNode.textContent = "";
        return;
      }

      successNode.textContent = "Thank you. Your message has been recorded successfully.";
      contactForm.reset();
    });
  }
});
