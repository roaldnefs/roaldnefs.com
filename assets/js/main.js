(function () {
  var root = document.documentElement;

  // Header: on pages with a sidebar it slides away while scrolling down
  // so the sidebar has room, and returns when scrolling up.
  if (document.body.classList.contains("has-aside")) {
    var lastY = 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      root.classList.toggle("header-hidden", y > 200 && y > lastY);
      lastY = y;
    }, { passive: true });
  }

  // Menu on small screens
  var toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", function () {
    var open = root.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("menu-open")) toggle.click();
  });

  // Carousels: the arrows move the row by one card
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector("[data-carousel-track]");
    function move(dir) {
      var card = track.firstElementChild;
      var step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
      track.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    carousel.querySelector("[data-carousel-prev]").addEventListener("click", function () { move(-1); });
    carousel.querySelector("[data-carousel-next]").addEventListener("click", function () { move(1); });
  });

  // Table of contents: mark the section being read
  var toc = document.querySelector("[data-toc]");
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll("a"));
    var heads = links.map(function (a) {
      return document.getElementById(decodeURIComponent(a.hash.slice(1)));
    });
    var mark = function () {
      var current = 0;
      heads.forEach(function (h, i) {
        if (h && h.getBoundingClientRect().top < 140) current = i;
      });
      links.forEach(function (a, i) {
        if (i === current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    window.addEventListener("scroll", mark, { passive: true });
    mark();
  }

  // Code blocks: copy button
  if (navigator.clipboard) {
    document.querySelectorAll(".code-copy").forEach(function (button) {
      button.hidden = false;
      button.addEventListener("click", function () {
        var code = button.closest(".code").querySelector("pre").innerText;
        navigator.clipboard.writeText(code).then(function () {
          button.textContent = "Copied";
          setTimeout(function () { button.textContent = "Copy"; }, 1600);
        });
      });
    });
  }

  // Analytics: Google Analytics loads only after the visitor accepts.
  // The banner is only rendered on production builds.
  var consent = document.querySelector("[data-consent]");
  if (consent) {
    var id = consent.dataset.gaId;
    var loadAnalytics = function () {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", id);
      var script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
      document.head.appendChild(script);
    };

    var choice = localStorage.getItem("consent");
    if (choice === "granted") loadAnalytics();
    else if (!choice) consent.hidden = false;

    consent.querySelectorAll("[data-consent-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var previous = localStorage.getItem("consent");
        var next = button.dataset.consentChoice;
        localStorage.setItem("consent", next);
        consent.hidden = true;
        if (next === "granted" && previous !== "granted") loadAnalytics();
        if (next === "denied" && previous === "granted") {
          // Withdrawn: remove the Google Analytics cookies and stop the running tag
          document.cookie.split("; ").forEach(function (cookie) {
            var name = cookie.split("=")[0];
            if (name.indexOf("_ga") === 0) {
              document.cookie = name + "=; Max-Age=0; path=/; domain=" + location.hostname;
            }
          });
          location.reload();
        }
      });
    });

    document.querySelector("[data-consent-open]").addEventListener("click", function () {
      consent.hidden = false;
    });
  }
})();
