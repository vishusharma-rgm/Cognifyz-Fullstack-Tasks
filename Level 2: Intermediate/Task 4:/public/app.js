(function () {
  const form = document.getElementById("applicationForm");
  const routePanels = document.querySelectorAll("[data-route]");
  const routeLinks = document.querySelectorAll("[data-link]");
  const progressFill = document.getElementById("progressFill");
  const routeTitle = document.getElementById("routeTitle");
  const completionScore = document.getElementById("completionScore");
  const applicationCount = document.getElementById("applicationCount");
  const liveBadge = document.getElementById("liveBadge");
  const restartFlow = document.getElementById("restartFlow");
  const routeOrder = ["welcome", "account", "profile", "review", "success"];
  const formState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    track: "",
    bio: "",
    acceptTerms: false
  };

  function currentRoute() {
    const hash = window.location.hash.replace("#", "");
    return routeOrder.includes(hash) ? hash : "welcome";
  }

  function setRoute(routeName) {
    const safeRoute = routeOrder.includes(routeName) ? routeName : "welcome";
    if (window.location.hash.replace("#", "") !== safeRoute) {
      window.location.hash = safeRoute;
      return;
    }

    routePanels.forEach(function (panel) {
      panel.classList.toggle("active", panel.dataset.route === safeRoute);
    });

    routeLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + safeRoute);
    });

    routeTitle.textContent =
      safeRoute.charAt(0).toUpperCase() + safeRoute.slice(1);
    const routeIndex = routeOrder.indexOf(safeRoute);
    const percent = safeRoute === "success" ? 100 : Math.max(0, routeIndex) * 25;
    progressFill.style.width = percent + "%";
  }

  function setError(fieldName, message) {
    const errorNode = document.querySelector('[data-error="' + fieldName + '"]');
    if (errorNode) {
      errorNode.textContent = message || "";
    }
  }

  function clearErrors() {
    [
      "fullName",
      "email",
      "password",
      "confirmPassword",
      "role",
      "track",
      "bio",
      "acceptTerms"
    ].forEach(function (fieldName) {
      setError(fieldName, "");
    });
  }

  function validateLocalState() {
    const errors = {};

    if (formState.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters long.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
        formState.password
      )
    ) {
      errors.password =
        "Password must be 8+ characters with uppercase, lowercase, number, and symbol.";
    }

    if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = "Confirm password must match the password.";
    }

    if (!window.formConfig.roleOptions.includes(formState.role)) {
      errors.role = "Please choose a valid internship role.";
    }

    if (!window.formConfig.trackOptions.includes(formState.track)) {
      errors.track = "Please choose a valid specialization track.";
    }

    if (formState.bio.trim().length < 20) {
      errors.bio = "Professional summary must be at least 20 characters long.";
    }

    if (!formState.acceptTerms) {
      errors.acceptTerms = "You must accept the application terms.";
    }

    return errors;
  }

  function updatePreview() {
    document.getElementById("previewName").textContent =
      formState.fullName.trim() || "Candidate Name";
    document.getElementById("previewRole").textContent =
      formState.role || "Preferred role will appear here";
    document.getElementById("reviewName").textContent =
      formState.fullName.trim() || "Candidate Name";
    document.getElementById("reviewEmail").textContent =
      formState.email.trim() || "name@example.com";
    document.getElementById("reviewRole").textContent =
      formState.role || "Not selected";
    document.getElementById("reviewTrack").textContent =
      formState.track || "Not selected";
    document.getElementById("reviewBio").textContent =
      formState.bio.trim() || "Your profile summary will appear here.";

    const filledFields = [
      formState.fullName.trim(),
      formState.email.trim(),
      formState.password,
      formState.confirmPassword,
      formState.role,
      formState.track,
      formState.bio.trim(),
      formState.acceptTerms
    ].filter(Boolean).length;

    const score = Math.round((filledFields / 8) * 100);
    completionScore.textContent = score + "%";
    liveBadge.textContent = score === 100 ? "Ready for submission" : "Draft in progress";
    document.getElementById("bioCount").textContent =
      formState.bio.trim().length + " / 220";
  }

  function updateStrengthMeter(password) {
    const checks = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
      password.length >= 8
    ];
    const score = checks.filter(Boolean).length;
    const percent = (score / 5) * 100;
    const strengthFill = document.getElementById("strengthFill");
    const strengthLabel = document.getElementById("strengthLabel");
    const strengthHint = document.getElementById("strengthHint");

    strengthFill.style.width = percent + "%";

    if (score <= 2) {
      strengthFill.style.background = "#c13d3d";
      strengthLabel.textContent = "Password strength: Too weak";
      strengthHint.textContent = "Add more variety to your password.";
      return;
    }

    if (score === 3 || score === 4) {
      strengthFill.style.background = "#d48d17";
      strengthLabel.textContent = "Password strength: Medium";
      strengthHint.textContent = "Almost there. Add all required character types.";
      return;
    }

    strengthFill.style.background = "#16794a";
    strengthLabel.textContent = "Password strength: Strong";
    strengthHint.textContent = "Great. Your password meets the expected complexity.";
  }

  function syncStateFromForm() {
    formState.fullName = form.fullName.value;
    formState.email = form.email.value;
    formState.password = form.password.value;
    formState.confirmPassword = form.confirmPassword.value;
    formState.role = form.role.value;
    formState.track = form.track.value;
    formState.bio = form.bio.value;
    formState.acceptTerms = form.acceptTerms.checked;
    updatePreview();
    updateStrengthMeter(formState.password);
  }

  function validateRoute(routeName) {
    clearErrors();
    syncStateFromForm();
    const errors = validateLocalState();
    let routeFields = [];

    if (routeName === "account") {
      routeFields = ["fullName", "email", "password", "confirmPassword"];
    } else if (routeName === "profile") {
      routeFields = ["role", "track", "bio", "acceptTerms"];
    } else {
      routeFields = Object.keys(errors);
    }

    const visibleErrors = routeFields.filter(function (fieldName) {
      return errors[fieldName];
    });

    visibleErrors.forEach(function (fieldName) {
      setError(fieldName, errors[fieldName]);
    });

    return visibleErrors.length === 0;
  }

  document.querySelectorAll("[data-next-route]").forEach(function (button) {
    button.addEventListener("click", function () {
      const nextRoute = button.getAttribute("data-next-route");
      const current = currentRoute();

      if (current === "account" && !validateRoute("account")) {
        return;
      }

      if (current === "profile" && !validateRoute("profile")) {
        return;
      }

      setRoute(nextRoute);
    });
  });

  document.querySelectorAll("[data-prev-route]").forEach(function (button) {
    button.addEventListener("click", function () {
      setRoute(button.getAttribute("data-prev-route"));
    });
  });

  form.addEventListener("input", function () {
    syncStateFromForm();
  });

  form.addEventListener("change", function () {
    syncStateFromForm();
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();
    syncStateFromForm();
    const errors = validateLocalState();

    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(function (fieldName) {
        setError(fieldName, errors[fieldName]);
      });
      setRoute("review");
      return;
    }

    const payload = {
      fullName: formState.fullName.trim(),
      email: formState.email.trim(),
      password: formState.password,
      confirmPassword: formState.confirmPassword,
      role: formState.role,
      track: formState.track,
      bio: formState.bio.trim(),
      acceptTerms: formState.acceptTerms
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        Object.entries(result.errors || {}).forEach(function (entry) {
          setError(entry[0], entry[1]);
        });
        return;
      }

      applicationCount.textContent = String(result.totalApplications);
      document.getElementById("successTitle").textContent =
        result.application.fullName + ", your application has been submitted.";
      document.getElementById("successCopy").textContent =
        "Role: " +
        result.application.role +
        " | Track: " +
        result.application.track +
        " | Client-side routing kept the experience on the same page.";
      liveBadge.textContent = "Submitted";
      window.location.hash = "success";
    } catch (error) {
      liveBadge.textContent = "Submission failed";
    }
  });

  restartFlow.addEventListener("click", function () {
    form.reset();
    Object.keys(formState).forEach(function (key) {
      formState[key] = key === "acceptTerms" ? false : "";
    });
    clearErrors();
    updateStrengthMeter("");
    updatePreview();
    window.location.hash = "welcome";
  });

  window.addEventListener("hashchange", function () {
    setRoute(currentRoute());
  });

  syncStateFromForm();
  setRoute(currentRoute());
})();
