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

  // Analytics: the Google tag in <head> starts with analytics consent denied,
  // unless the visitor accepted earlier. Accepting here grants it.
  // The tag and the banner are only rendered on production builds.
  var consent = document.querySelector("[data-consent]");
  if (consent) {
    if (!localStorage.getItem("consent")) consent.hidden = false;

    consent.querySelectorAll("[data-consent-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        var previous = localStorage.getItem("consent");
        var next = button.dataset.consentChoice;
        localStorage.setItem("consent", next);
        consent.hidden = true;
        if (next === "granted") window.gtag("consent", "update", { analytics_storage: "granted" });
        if (next === "denied" && previous === "granted") {
          // Withdrawn: remove the Google Analytics cookies and reload, so the page starts denied
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
