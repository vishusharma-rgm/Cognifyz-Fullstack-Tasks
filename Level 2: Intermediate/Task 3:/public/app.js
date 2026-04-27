document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll("[data-reveal]");
  const timelineWrappers = document.querySelectorAll(".timeline-wrapper");
  const heroParallax = document.querySelector(".hero-parallax");
  const heroOrbs = document.querySelectorAll(".hero-orb");
  const contactForm = document.getElementById("contactForm");
  const tiltCards = document.querySelectorAll(".content-card, .timeline-card");
  const depthStages = document.querySelectorAll("[data-depth-stage]");
  const feedbackTriggers = document.querySelectorAll("[data-feedback-trigger]");
  const feedbackModalElement = document.getElementById("feedbackModal");

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

  function updateTimelineProgress() {
    timelineWrappers.forEach(function (timeline) {
      const rect = timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const progress = (viewportHeight - rect.top) / (rect.height + viewportHeight * 0.35);
      const clampedProgress = Math.max(0, Math.min(progress, 1));

      timeline.style.setProperty("--timeline-progress", clampedProgress.toFixed(3));
    });
  }

  updateTimelineProgress();

  let isTimelineTicking = false;

  function requestTimelineProgressUpdate() {
    if (isTimelineTicking) {
      return;
    }

    isTimelineTicking = true;

    window.requestAnimationFrame(function () {
      updateTimelineProgress();
      isTimelineTicking = false;
    });
  }

  window.addEventListener("scroll", requestTimelineProgressUpdate, { passive: true });
  window.addEventListener("resize", requestTimelineProgressUpdate);

  if (heroParallax) {
    window.addEventListener("scroll", function () {
      const offset = Math.min(window.scrollY * 0.08, 24);
      heroParallax.style.transform = "translateY(" + offset + "px)";

      heroOrbs.forEach(function (orb, index) {
        const movement = Math.min(window.scrollY * (index === 0 ? 0.04 : 0.06), 18);
        orb.style.transform = "translateY(" + movement + "px)";
      });
    });
  }

  if (window.matchMedia("(hover: hover)").matches) {
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        const rect = card.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const rotateY = ((offsetX / rect.width) - 0.5) * 5;
        const rotateX = (0.5 - (offsetY / rect.height)) * 5;

        card.style.setProperty("--card-rotate-x", rotateX.toFixed(2) + "deg");
        card.style.setProperty("--card-rotate-y", rotateY.toFixed(2) + "deg");
      });

      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--card-rotate-x", "0deg");
        card.style.setProperty("--card-rotate-y", "0deg");
      });
    });

    depthStages.forEach(function (stage) {
      stage.addEventListener("mousemove", function (event) {
        const rect = stage.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const rotateY = ((offsetX / rect.width) - 0.5) * 10;
        const rotateX = (0.5 - (offsetY / rect.height)) * 10;

        stage.style.setProperty("--depth-rotate-x", rotateX.toFixed(2) + "deg");
        stage.style.setProperty("--depth-rotate-y", rotateY.toFixed(2) + "deg");
      });

      stage.addEventListener("mouseleave", function () {
        stage.style.setProperty("--depth-rotate-x", "0deg");
        stage.style.setProperty("--depth-rotate-y", "0deg");
      });
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

  if (feedbackTriggers.length > 0 && feedbackModalElement && window.bootstrap) {
    const feedbackModal = new window.bootstrap.Modal(feedbackModalElement);
    const modalFields = {
      author: document.getElementById("feedbackModalAuthor"),
      role: document.getElementById("feedbackModalRole"),
      company: document.getElementById("feedbackModalCompany"),
      project: document.getElementById("feedbackModalProject"),
      quote: document.getElementById("feedbackModalQuote"),
      focus: document.getElementById("feedbackModalFocus"),
      outcome: document.getElementById("feedbackModalOutcome"),
      title: document.getElementById("feedbackModalLabel")
    };

    function openFeedbackModal(trigger) {
      modalFields.author.textContent = trigger.dataset.feedbackAuthor || "Client";
      modalFields.role.textContent = trigger.dataset.feedbackRole || "";
      modalFields.company.textContent = trigger.dataset.feedbackCompany || "";
      modalFields.project.textContent = trigger.dataset.feedbackProject || "";
      modalFields.quote.textContent = '"' + (trigger.dataset.feedbackQuote || "") + '"';
      modalFields.focus.textContent = trigger.dataset.feedbackFocus || "";
      modalFields.outcome.textContent = trigger.dataset.feedbackOutcome || "";
      modalFields.title.textContent =
        (trigger.dataset.feedbackAuthor || "Client") + " feedback";

      feedbackModal.show();
    }

    feedbackTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openFeedbackModal(trigger);
      });

      trigger.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFeedbackModal(trigger);
        }
      });
    });
  }
});
