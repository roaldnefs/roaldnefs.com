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
    var queued = false;
    window.addEventListener("scroll", function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        mark();
      });
    }, { passive: true });
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

  // Booking form: sends the request to HubSpot. It starts hidden, so without
  // JavaScript the email address below it is the way to book.
  var booking = document.querySelector("[data-book-form]");
  if (booking) {
    var bookingStatus = booking.querySelector("[data-book-status]");
    var bookingSend = booking.querySelector("button");
    booking.hidden = false;
    booking.addEventListener("submit", function (e) {
      e.preventDefault();
      // Only bots fill in the field that visitors can't see
      if (booking.elements.website.value) return;
      var fields = [];
      var lines = [];
      new FormData(booking).forEach(function (value, name) {
        if (name === "website" || !value) return;
        fields.push({ objectTypeId: "0-1", name: name, value: value });
        lines.push(booking.elements[name].closest("label").firstChild.textContent.trim() + ": " + value);
      });
      bookingSend.disabled = true;
      bookingStatus.textContent = "Sending…";
      fetch(booking.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: fields, context: { pageUri: location.href, pageName: document.title } })
      }).then(function (response) {
        if (!response.ok) throw new Error(response.status);
        booking.reset();
        bookingStatus.textContent = "Thanks, your request is in. I'll reply by email.";
      }).catch(function () {
        // Content blockers often stop requests to HubSpot, so offer the same request as an email
        var mail = document.createElement("a");
        mail.href = "mailto:info@roaldnefs.com?subject=" + encodeURIComponent("Session request") +
          "&body=" + encodeURIComponent(lines.join("\n"));
        mail.textContent = "Send it by email instead";
        bookingStatus.textContent = "That didn't go through, possibly because of a content blocker. ";
        bookingStatus.appendChild(mail);
      }).then(function () {
        bookingSend.disabled = false;
      });
    });
  }

  // Videos: the YouTube player is only loaded once the visitor presses play
  document.querySelectorAll("[data-video-id]").forEach(function (button) {
    button.addEventListener("click", function () {
      var player = document.createElement("iframe");
      player.src = "https://www.youtube-nocookie.com/embed/" + button.dataset.videoId + "?autoplay=1";
      player.title = button.getAttribute("aria-label").replace(/^Play: /, "");
      player.allow = "autoplay; encrypted-media; picture-in-picture";
      player.allowFullscreen = true;
      button.replaceWith(player);
      player.focus();
    });
  });

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
