/* ════════════════════════════════════════════════════════════
   Portfolio interactions
   - Sidebar active state on click
   - Reveal-on-scroll for cards
═════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   Password gate — a single unlock for all work
   The home page hides every work title (menu + tiles) until the
   visitor clicks "See my work" and enters the password. Once
   unlocked, the flag is remembered and the work case-study pages
   open freely; landing on a work page while still locked sends the
   visitor back to the home page.
═════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var PASSWORD = "12340114";
  var UNLOCK_KEY = "portfolio-unlocked";
  var WORK_PAGES = {
    "eventstream.html": 1,
    "business-events.html": 1,
    "get-data.html": 1,
    "custom-connector.html": 1,
    "schematize.html": 1,
    "top20talent.html": 1,
    "asa.html": 1,
    "event-hub.html": 1,
  };

  function isUnlocked() {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function setUnlocked() {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch (e) {}
  }

  var page = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  // A work case-study page reached while still locked → go home.
  if (WORK_PAGES[page]) {
    if (!isUnlocked()) {
      window.location.replace("index.html");
    }
    return;
  }

  // Everything below only applies to the home page.
  if (page !== "index.html" && page !== "") return;

  function reveal() {
    document.documentElement.classList.remove("work-locked");
  }

  var overlay = document.createElement("div");
  overlay.className = "lock-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "lockTitle");
  overlay.innerHTML =
    '<div class="lock-card">' +
    '<button class="lock-close" type="button" aria-label="Close">×</button>' +
    '<div class="lock-icon" aria-hidden="true">🔒</div>' +
    '<h2 class="lock-title" id="lockTitle">This work is password protected</h2>' +
    '<p class="lock-desc">Enter the password to view my case studies.</p>' +
    '<form class="lock-form" novalidate>' +
    '<input class="lock-input" type="password" inputmode="numeric" autocomplete="off" placeholder="Password" aria-label="Password" />' +
    '<button class="lock-btn" type="submit" disabled>Unlock</button>' +
    "</form>" +
    '<p class="lock-error" role="alert" hidden>Incorrect password. Please try again.</p>' +
    "</div>";

  function openGate(onSuccess) {
    document.body.appendChild(overlay);
    document.body.classList.add("is-locked");

    var card = overlay.querySelector(".lock-card");
    var input = overlay.querySelector(".lock-input");
    var form = overlay.querySelector(".lock-form");
    var button = overlay.querySelector(".lock-btn");
    var error = overlay.querySelector(".lock-error");
    var closeBtn = overlay.querySelector(".lock-close");

    if (input) input.focus();

    function dismiss() {
      document.body.classList.remove("is-locked");
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    input.addEventListener("input", function () {
      button.disabled = input.value.length === 0;
    });

    closeBtn.addEventListener("click", dismiss);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value.length === 0) return;
      if (input.value === PASSWORD) {
        setUnlocked();
        reveal();
        dismiss();
        if (typeof onSuccess === "function") onSuccess();
      } else {
        error.hidden = false;
        input.value = "";
        button.disabled = true;
        input.focus();
        card.classList.remove("shake");
        void card.offsetWidth; // restart the shake animation
        card.classList.add("shake");
      }
    });
  }

  function init() {
    if (isUnlocked()) reveal();

    var seeWork = document.querySelector(".intro__scroll");
    if (seeWork) {
      seeWork.addEventListener("click", function (e) {
        if (isUnlocked()) return; // already unlocked → normal scroll
        e.preventDefault();
        openGate(function () {
          var work = document.getElementById("work");
          if (work) work.scrollIntoView({ behavior: "smooth" });
        });
      });
    }
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();

(function () {
  "use strict";

  // ── Dark mode toggle ─────────────────────────────────────
  var root = document.documentElement;
  var toggles = document.querySelectorAll(".theme-switch");

  function syncToggle() {
    var isDark = root.getAttribute("data-theme") === "dark";
    toggles.forEach(function (toggle) {
      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      var label = toggle.querySelector(".theme-switch__label");
      if (label) {
        label.textContent = isDark
          ? "Switch to light mode"
          : "Switch to dark mode";
      }
    });
  }
  syncToggle();

  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncToggle();
    });
  });

  // ── Sidebar collapse ─────────────────────────────────────
  var app = document.querySelector(".app");
  var collapseBtn = document.querySelector(".nav-collapse");
  var reopenBtn = document.querySelector(".nav-reopen");

  function isMobileNav() {
    try {
      return window.matchMedia("(max-width: 880px)").matches;
    } catch (e) {
      return false;
    }
  }

  if (app) {
    // On mobile the menu is a full-screen overlay, so always start
    // closed. On desktop, restore the saved collapse preference.
    try {
      if (isMobileNav()) {
        app.setAttribute("data-nav-collapsed", "true");
      } else if (localStorage.getItem("nav-collapsed") === "true") {
        app.setAttribute("data-nav-collapsed", "true");
      }
    } catch (e) {}

    function setNav(collapsed) {
      app.setAttribute("data-nav-collapsed", collapsed ? "true" : "false");
      // Don't persist the mobile overlay's open/closed state — it would
      // leak into the desktop sidebar preference.
      if (!isMobileNav()) {
        try {
          localStorage.setItem("nav-collapsed", collapsed ? "true" : "false");
        } catch (e) {}
      }
      if (collapsed && reopenBtn) {
        reopenBtn.focus();
      } else if (!collapsed && collapseBtn) {
        collapseBtn.focus();
      }
    }

    if (collapseBtn) {
      collapseBtn.addEventListener("click", function () {
        setNav(true);
      });
    }
    if (reopenBtn) {
      reopenBtn.addEventListener("click", function () {
        setNav(false);
      });
    }
  }

  // ── Sidebar active state ─────────────────────────────────
  var items = document.querySelectorAll(".nav__item");

  // Highlight the nav item matching the current page on load.
  var currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  var onIndex = currentPage === "" || currentPage === "index.html";
  items.forEach(function (item) {
    var href = (item.getAttribute("href") || "").toLowerCase();
    var file = href.split("#")[0].split("?")[0];
    if (onIndex) {
      if (href === "#about") item.classList.add("is-active");
    } else if (file && file === currentPage) {
      item.classList.add("is-active");
    }
  });

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      // Only toggle for in-page section links, not mailto/external.
      var href = item.getAttribute("href") || "";
      // Close the full-screen overlay menu on mobile after a selection.
      if (app && isMobileNav()) {
        app.setAttribute("data-nav-collapsed", "true");
      }
      if (href.charAt(0) !== "#") return;
      items.forEach(function (el) {
        el.classList.remove("is-active");
      });
      item.classList.add("is-active");
    });
  });

  // ── Floating engine: a light spring gives each prop an elastic "wave" when
  //    you scroll (a quick ripple that settles), props gently bump apart if
  //    they drift into each other, and everything always floats back to its
  //    starting spot. On phones, tilting the device nudges them toward the
  //    low edge (without overlapping). The props own their full transform
  //    here, so nothing fights a CSS keyframe.
  var fReduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fReduce) {
    // Per-prop personality:
    // [selector, ampY, ampX, period, phase, kickY, kickX, radius, tilt]
    //  kickY/kickX signs+sizes differ → each rides the scroll wave in its own
    //  direction/speed; radius is the soft collision size; tilt scales the
    //  device-orientation nudge on mobile.
    var fConfig = [
      [".conn-hov--laptop", 6, 4, 6.6, 0.0, 0.10, 0.05, 46, 0.9],
      [".conn-hov--box", 8, 6, 5.2, 2.1, -0.17, -0.09, 40, 1.25],
      [".conn-hov--hud", 5, 6, 7.6, 4.0, 0.075, 0.14, 28, 1.1],
    ];
    var fStates = [];
    document
      .querySelectorAll(".card__media--connector:not(.proj-banner)")
      .forEach(function (scene) {
        fConfig.forEach(function (cfg) {
          scene.querySelectorAll(cfg[0]).forEach(function (el) {
            fStates.push({
              el: el,
              ampY: cfg[1], ampX: cfg[2], period: cfg[3], phase: cfg[4],
              kickY: cfg[5], kickX: cfg[6], radius: cfg[7], tilt: cfg[8],
              // spring offset + velocity
              x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0,
              // resting center (measured once); live center = rest + offset
              rcx: 0, rcy: 0, measured: false,
            });
          });
        });
      });

    if (fStates.length) {
      var fVisible = false;
      var fRunning = false;
      var fPrevT = 0;
      var fStartT = 0;
      var fLastScroll = window.scrollY || window.pageYOffset || 0;
      // Device-orientation nudge target (set on mobile by tilting).
      var fTiltX = 0, fTiltY = 0;

      function fClamp(v, m) {
        return v < -m ? -m : v > m ? m : v;
      }

      // Measure each prop's resting center once (offset must be ~0 here).
      function fMeasure() {
        fStates.forEach(function (s) {
          var prev = s.el.style.transform;
          s.el.style.transform = "none";
          var b = s.el.getBoundingClientRect();
          s.el.style.transform = prev;
          s.rcx = b.left + b.width / 2;
          s.rcy = b.top + b.height / 2;
          s.measured = true;
        });
      }

      function fTick(t) {
        if (!fStartT) {
          fStartT = t;
          fPrevT = t;
        }
        var dt = Math.min(0.04, (t - fPrevT) / 1000) || 0.016;
        fPrevT = t;
        var elapsed = (t - fStartT) / 1000;

        // 1) Spring each prop toward its resting float target. The target is a
        //    slow idle drift (+ the device-tilt nudge on mobile). Light damping
        //    leaves a subtle elastic overshoot = the "wave" feel.
        fStates.forEach(function (s) {
          var driftY =
            Math.sin((elapsed / s.period) * Math.PI * 2 + s.phase) * s.ampY;
          var driftX =
            Math.cos((elapsed / (s.period * 1.3)) * Math.PI * 2 + s.phase) *
            s.ampX;
          var targetY = driftY + fTiltY * s.tilt;
          var targetX = driftX + fTiltX * s.tilt;
          // Underdamped spring (k≈90, ζ≈0.4) → quick, lively, slight bounce.
          var k = 90, c = 7.6;
          s.vy += ((targetY - s.y) * k - s.vy * c) * dt;
          s.vx += ((targetX - s.x) * k - s.vx * c) * dt;
          s.vr += ((0 - s.r) * 70 - s.vr * 7) * dt;
          s.y += s.vy * dt;
          s.x += s.vx * dt;
          s.r += s.vr * dt;
        });

        // 2) Gentle collision: if two props drift into each other, ease them a
        //    little apart with a soft bounce + tiny spin. The spring above then
        //    floats them back to rest — 輕輕的彈開一點點，然後恢復初始位置.
        for (var p = 0; p < fStates.length; p++) {
          for (var q = p + 1; q < fStates.length; q++) {
            var A = fStates[p], B = fStates[q];
            var dx = B.rcx + B.x - (A.rcx + A.x);
            var dy = B.rcy + B.y - (A.rcy + A.y);
            var dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
            var minDist = A.radius + B.radius;
            if (dist < minDist) {
              var overlap = (minDist - dist) / minDist;
              var nx = dx / dist, ny = dy / dist;
              // Soft positional separation (small, not a hard shove).
              var sep = overlap * 24;
              A.x -= nx * sep * dt;
              A.y -= ny * sep * dt;
              B.x += nx * sep * dt;
              B.y += ny * sep * dt;
              // A light bounce so they spring apart a touch, then settle back.
              var rvn = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
              if (rvn < 0) {
                var imp = -0.6 * rvn; // gentle restitution
                A.vx -= nx * imp; A.vy -= ny * imp;
                B.vx += nx * imp; B.vy += ny * imp;
              }
              A.vr -= overlap * 8;
              B.vr += overlap * 8;
            }
          }
        }

        // 3) Clamp + render.
        fStates.forEach(function (s) {
          s.x = fClamp(s.x, 46);
          s.y = fClamp(s.y, 46);
          s.r = fClamp(s.r, 8);
          s.el.style.transform =
            "translate(" +
            s.x.toFixed(2) +
            "px," +
            s.y.toFixed(2) +
            "px) rotate(" +
            s.r.toFixed(2) +
            "deg)";
        });

        if (fVisible) {
          requestAnimationFrame(fTick);
        } else {
          fRunning = false;
        }
      }

      function fStartLoop() {
        if (!fRunning && fVisible) {
          if (!fStates[0].measured) fMeasure();
          fRunning = true;
          fPrevT = 0;
          fStartT = 0;
          requestAnimationFrame(fTick);
        }
      }

      // Scroll sends a velocity impulse (the wave kick) — opposite the scroll,
      // sized/signed per prop so they ripple in their own direction & speed.
      window.addEventListener(
        "scroll",
        function () {
          var y = window.scrollY || window.pageYOffset || 0;
          var delta = y - fLastScroll;
          fLastScroll = y;
          if (!fVisible) return;
          // Cap a single delta so a jump-scroll can't fling them off.
          var d = fClamp(delta, 60);
          fStates.forEach(function (s) {
            s.vy += -d * s.kickY * 16;
            s.vx += -d * s.kickX * 16;
            s.vr += -d * s.kickX * 4;
          });
          fStartLoop();
        },
        { passive: true }
      );

      // Re-measure rest centers after layout changes.
      var fResizeT;
      window.addEventListener(
        "resize",
        function () {
          clearTimeout(fResizeT);
          fResizeT = setTimeout(fMeasure, 150);
        },
        { passive: true }
      );

      // Mobile: tilt the phone → props flow toward the low edge/corner.
      function fOrient(e) {
        if (e.gamma == null && e.beta == null) return;
        // gamma: left/right tilt (-90..90), beta: front/back (-180..180).
        // Map to a bounded nudge; beta neutral ~45° (phone held up).
        // (fClamp(v, m) clamps to ±m, so pass 1 to clamp the ratio to ±1.)
        fTiltX = fClamp((e.gamma || 0) / 35, 1) * 26;
        fTiltY = fClamp(((e.beta || 45) - 45) / 35, 1) * 26;
        fStartLoop();
      }
      function fEnableTilt() {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
          // iOS 13+ needs a user gesture to grant permission.
          DeviceOrientationEvent.requestPermission()
            .then(function (res) {
              if (res === "granted")
                window.addEventListener("deviceorientation", fOrient);
            })
            .catch(function () {});
        } else if ("DeviceOrientationEvent" in window) {
          window.addEventListener("deviceorientation", fOrient);
        }
      }
      if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
        // Try immediately; if permission is required, retry on first touch.
        fEnableTilt();
        window.addEventListener("touchstart", fEnableTilt, { once: true });
      }

      // Only animate while the scene is on screen (saves work + jank).
      if ("IntersectionObserver" in window) {
        var fIo = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (en) {
              var wasVisible = fVisible;
              fVisible = en.isIntersecting;
              if (fVisible && !wasVisible) {
                fLastScroll = window.scrollY || window.pageYOffset || 0;
                fStartLoop();
              }
            });
          },
          { threshold: 0.05, rootMargin: "10% 0px 10% 0px" }
        );
        document
          .querySelectorAll(".card__media--connector:not(.proj-banner)")
          .forEach(function (s) {
            fIo.observe(s);
          });
      } else {
        fVisible = true;
        fStartLoop();
      }
    }
  }

  // ── Embedded prototype modal ─────────────────────────────
  // A button with [data-embed-modal="<id>"] opens the matching
  // .embed-modal full-screen, lazily loading its iframe (data-embed-src).
  (function () {
    var openers = document.querySelectorAll("[data-embed-modal]");
    if (!openers.length) return;
    var lastFocus = null;

    // Ensure a loading overlay exists inside the modal panel and return it.
    function ensureLoader(modal) {
      var panel = modal.querySelector(".embed-modal__panel");
      if (!panel) return null;
      var loader = panel.querySelector(".embed-modal__loader");
      if (!loader) {
        loader = document.createElement("div");
        loader.className = "embed-modal__loader";
        loader.setAttribute("aria-hidden", "true");
        loader.innerHTML =
          '<div class="embed-modal__spinner"></div>' +
          '<p class="embed-modal__loading-text">Loading prototype…</p>';
        panel.appendChild(loader);
      }
      return loader;
    }

    function openModal(modal) {
      var frame = modal.querySelector("[data-embed-src]");
      var loader = ensureLoader(modal);
      if (frame && !frame.src) {
        // First open: show the loader until the embedded prototype loads.
        if (loader) modal.classList.add("is-loading");
        frame.addEventListener(
          "load",
          function () {
            modal.classList.remove("is-loading");
          },
          { once: true }
        );
        frame.src = frame.getAttribute("data-embed-src");
      }
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector(".embed-modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeModal(modal) {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }

    openers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var modal = document.getElementById(
          btn.getAttribute("data-embed-modal")
        );
        if (!modal) return;
        lastFocus = btn;
        openModal(modal);
      });
    });

    document.querySelectorAll(".embed-modal").forEach(function (modal) {
      modal.querySelectorAll("[data-embed-close]").forEach(function (el) {
        el.addEventListener("click", function () {
          closeModal(modal);
        });
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".embed-modal").forEach(function (modal) {
        if (!modal.hidden) closeModal(modal);
      });
    });
  })();

  // ── Reveal on scroll ─────────────────────────────────────
  var reveals = document.querySelectorAll(".reveal");

  // Stagger card reveals for a cascading entrance.
  var cardReveals = document.querySelectorAll(".cards .card.reveal");
  cardReveals.forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.08).toFixed(2) + "s";
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ── Card tilt + cursor spotlight ─────────────────────────
  var finePointer =
    window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer && !reduceMotion) {
    var tiltCards = document.querySelectorAll(".cards .card__link");
    var MAX_TILT = 1.5; // degrees
    tiltCards.forEach(function (link) {
      var raf = null;
      function onMove(e) {
        var rect = link.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        // Spotlight position (percent).
        link.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        link.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var rx = (0.5 - py) * MAX_TILT;
          var ry = (px - 0.5) * MAX_TILT;
          link.style.transform =
            "perspective(1000px) translateY(0px) rotateX(" +
            rx.toFixed(2) +
            "deg) rotateY(" +
            ry.toFixed(2) +
            "deg)";
        });
      }
      function onLeave() {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        link.style.transform = "";
      }
      link.addEventListener("pointermove", onMove);
      link.addEventListener("pointerleave", onLeave);
    });
  }

  // ── Intro photo parallax (mouse + scroll) ────────────────
  var photoWrap = document.querySelector(".intro__media");
  if (photoWrap && !reduceMotion) {
    var targetX = 0; // from mouse
    var targetY = 0;
    var curX = 0;
    var curY = 0;
    var scrollY = 0; // from scroll
    var pRaf = null;
    var mouseActive = finePointer;

    function renderPhoto() {
      pRaf = null;
      // Ease current toward target for smooth follow.
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      photoWrap.style.setProperty("--px", curX.toFixed(2) + "px");
      photoWrap.style.setProperty("--py", (curY + scrollY).toFixed(2) + "px");
      // Keep animating while easing hasn't settled.
      if (
        Math.abs(targetX - curX) > 0.1 ||
        Math.abs(targetY - curY) > 0.1
      ) {
        pRaf = requestAnimationFrame(renderPhoto);
      }
    }
    function requestRender() {
      if (!pRaf) pRaf = requestAnimationFrame(renderPhoto);
    }

    if (mouseActive) {
      window.addEventListener("pointermove", function (e) {
        // Range −1..1 from viewport center, scaled to pixels.
        var nx = e.clientX / window.innerWidth - 0.5;
        var ny = e.clientY / window.innerHeight - 0.5;
        targetX = nx * 12;
        targetY = ny * 12;
        requestRender();
      });
    }
  }

  // ── Lightbox (images + embeds) ───────────────────────────
  var zoomImgs = document.querySelectorAll(
    ".proj-figure__img, .proj-gallery__img"
  );
  var embeds = document.querySelectorAll(".proj-embed");

  if (zoomImgs.length || embeds.length) {
    // Build overlay once.
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("aria-hidden", "true");
    lb.innerHTML =
      '<div class="lightbox__backdrop" data-close></div>' +
      '<button class="lightbox__close" type="button" aria-label="Close" data-close>×</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">‹</button>' +
      '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">›</button>' +
      '<div class="lightbox__stage"></div>' +
      '<div class="lightbox__zoom" role="group" aria-label="Zoom controls">' +
      '<button class="lightbox__zbtn" type="button" data-zoom="out" aria-label="Zoom out">−</button>' +
      '<input class="lightbox__zrange" type="range" min="1" max="4" step="0.1" value="1" aria-label="Zoom level" />' +
      '<button class="lightbox__zbtn" type="button" data-zoom="in" aria-label="Zoom in">+</button>' +
      '<button class="lightbox__zbtn lightbox__zreset" type="button" data-zoom="reset" aria-label="Reset zoom">Reset</button>' +
      "</div>";
    document.body.appendChild(lb);
    var stage = lb.querySelector(".lightbox__stage");
    var zoomBar = lb.querySelector(".lightbox__zoom");
    var range = lb.querySelector(".lightbox__zrange");
    var navPrev = lb.querySelector(".lightbox__nav--prev");
    var navNext = lb.querySelector(".lightbox__nav--next");
    var lastFocus = null;
    var currentImg = null;

    // ── Image collection for prev/next ─────────────────────
    var imgList = Array.prototype.slice.call(zoomImgs);
    var currentIndex = -1;

    // ── Zoom + pan state ───────────────────────────────────
    var scale = 1;
    var panX = 0;
    var panY = 0;
    var MIN = 1;
    var MAX = 4;

    function applyTransform() {
      if (!currentImg) return;
      currentImg.style.transform =
        "translate(" + panX + "px," + panY + "px) scale(" + scale + ")";
      currentImg.style.cursor =
        scale > 1 ? "grab" : "zoom-in";
    }

    function setScale(next, originX, originY) {
      var clamped = Math.min(MAX, Math.max(MIN, next));
      if (clamped === scale) return;
      // Zoom toward a focal point (defaults to center).
      if (currentImg && originX != null) {
        var rect = currentImg.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = originX - cx;
        var dy = originY - cy;
        var ratio = clamped / scale;
        panX -= dx * (ratio - 1);
        panY -= dy * (ratio - 1);
      }
      scale = clamped;
      if (scale === 1) {
        panX = 0;
        panY = 0;
      }
      range.value = String(scale);
      applyTransform();
    }

    function resetZoom() {
      scale = 1;
      panX = 0;
      panY = 0;
      range.value = "1";
      applyTransform();
    }

    function openLightbox(node, isImage) {
      stage.innerHTML = "";
      stage.appendChild(node);
      currentImg = isImage ? node : null;
      resetZoom();
      zoomBar.style.display = isImage ? "" : "none";
      updateNav(isImage);
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function updateNav(isImage) {
      var multi = isImage && imgList.length > 1;
      navPrev.style.display = multi ? "" : "none";
      navNext.style.display = multi ? "" : "none";
    }

    function showImageAt(index) {
      if (!imgList.length) return;
      // Wrap around.
      currentIndex = (index + imgList.length) % imgList.length;
      var source = imgList[currentIndex];
      var big = new Image();
      big.src = source.currentSrc || source.src;
      big.alt = source.alt || "";
      big.className = "lightbox__img";
      openLightbox(big, true);
    }

    function closeLightbox() {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      stage.innerHTML = "";
      currentImg = null;
      currentIndex = -1;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // Zoom controls.
    zoomBar.addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-zoom");
      if (!act) return;
      if (act === "in") setScale(scale + 0.5);
      else if (act === "out") setScale(scale - 0.5);
      else if (act === "reset") resetZoom();
    });
    range.addEventListener("input", function () {
      setScale(parseFloat(range.value));
    });

    // Wheel to zoom over the image.
    stage.addEventListener(
      "wheel",
      function (e) {
        if (!currentImg) return;
        e.preventDefault();
        var delta = e.deltaY < 0 ? 0.2 : -0.2;
        setScale(scale + delta, e.clientX, e.clientY);
      },
      { passive: false }
    );

    // Drag to pan when zoomed in.
    var dragging = false;
    var startX = 0;
    var startY = 0;
    stage.addEventListener("pointerdown", function (e) {
      if (!currentImg || scale <= 1) return;
      dragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      currentImg.style.cursor = "grabbing";
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      applyTransform();
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (currentImg) currentImg.style.cursor = scale > 1 ? "grab" : "zoom-in";
    }
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    // Double-click to toggle zoom.
    stage.addEventListener("dblclick", function (e) {
      if (!currentImg) return;
      if (scale > 1) resetZoom();
      else setScale(2.5, e.clientX, e.clientY);
    });

    zoomImgs.forEach(function (img, idx) {
      img.classList.add("is-zoomable");
      img.addEventListener("click", function () {
        lastFocus = img;
        showImageAt(idx);
      });
    });

    // Prev / next navigation.
    navPrev.addEventListener("click", function (e) {
      e.stopPropagation();
      showImageAt(currentIndex - 1);
    });
    navNext.addEventListener("click", function (e) {
      e.stopPropagation();
      showImageAt(currentIndex + 1);
    });

    embeds.forEach(function (embed) {
      var iframe = embed.querySelector("iframe");
      if (!iframe) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "proj-embed__expand";
      btn.innerHTML = "⤢ Expand";
      embed.appendChild(btn);
      btn.addEventListener("click", function () {
        lastFocus = btn;
        var frame = document.createElement("iframe");
        frame.src = iframe.src;
        frame.title = iframe.title || "Embedded view";
        frame.className = "lightbox__iframe";
        openLightbox(frame, false);
      });
    });

    lb.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (currentImg && e.key === "ArrowLeft") showImageAt(currentIndex - 1);
      else if (currentImg && e.key === "ArrowRight") showImageAt(currentIndex + 1);
      else if (currentImg && (e.key === "+" || e.key === "=")) setScale(scale + 0.5);
      else if (currentImg && (e.key === "-" || e.key === "_")) setScale(scale - 0.5);
      else if (currentImg && e.key === "0") resetZoom();
    });
  }

  // ── Interactive mouse-following aura on the intro ─────────
  var intro = document.querySelector(".intro");
  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (intro && !prefersReduced) {
    // Target (where the cursor is) and current (eased) positions, in %
    var tx = 50, ty = 40, cx = 50, cy = 40;
    var rafId = null;
    var active = false;

    function render() {
      // Ease current toward target for a smooth, trailing motion
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      intro.style.setProperty("--mx", cx.toFixed(2) + "%");
      intro.style.setProperty("--my", cy.toFixed(2) + "%");

      // Keep animating while the cursor is present or still settling
      if (active || Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    }

    function ensureRaf() {
      if (rafId === null) rafId = requestAnimationFrame(render);
    }

    intro.addEventListener("pointermove", function (e) {
      var rect = intro.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
      ensureRaf();
    });

    intro.addEventListener("pointerenter", function () {
      active = true;
      intro.classList.add("is-pointer");
      ensureRaf();
    });

    intro.addEventListener("pointerleave", function () {
      active = false;
      intro.classList.remove("is-pointer");
      // Drift the glow gently back toward center
      tx = 50;
      ty = 40;
      ensureRaf();
    });
  }

  // ── 3D tilt + sheen on the "See my work" button ──────────
  var scrollBtn = document.querySelector(".intro__scroll");
  if (scrollBtn && !prefersReduced) {
    var MAX_TILT = 16; // degrees

    scrollBtn.addEventListener("pointermove", function (e) {
      var rect = scrollBtn.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width; // 0..1
      var py = (e.clientY - rect.top) / rect.height; // 0..1
      // Tilt away from the cursor for a "pressed corner" feel
      var ry = (px - 0.5) * 2 * MAX_TILT;
      var rx = -(py - 0.5) * 2 * MAX_TILT;
      scrollBtn.classList.add("is-tilting");
      scrollBtn.style.setProperty("--rx", rx.toFixed(2) + "deg");
      scrollBtn.style.setProperty("--ry", ry.toFixed(2) + "deg");
      scrollBtn.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      scrollBtn.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    });

    scrollBtn.addEventListener("pointerleave", function () {
      scrollBtn.classList.remove("is-tilting");
      scrollBtn.style.setProperty("--rx", "0deg");
      scrollBtn.style.setProperty("--ry", "0deg");
    });
  }
})();
