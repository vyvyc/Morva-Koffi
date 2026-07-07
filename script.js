const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsapAvailable = typeof window.gsap !== "undefined";

const showEverything = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const sectionsById = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navLinks.length && sectionsById.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    { threshold: [0.24, 0.42], rootMargin: "-18% 0px -62% 0px" }
  );

  sectionsById.forEach((section) => navObserver.observe(section));
}

const hero = document.querySelector("[data-hero]");
const header = document.querySelector(".site-header");

if (hero && header && "IntersectionObserver" in window) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-compact", !entry.isIntersecting);
    },
    { threshold: 0.18 }
  );
  headerObserver.observe(hero);
}

const menuTabs = Array.from(document.querySelectorAll("[data-menu-tab]"));
const menuPanels = Array.from(document.querySelectorAll("[data-menu-panel]"));

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.menuTab;

    menuTabs.forEach((candidate) => {
      const isActive = candidate === tab;
      candidate.classList.toggle("is-active", isActive);
      candidate.setAttribute("aria-selected", String(isActive));
      candidate.tabIndex = isActive ? 0 : -1;
    });

    menuPanels.forEach((panel) => {
      const isActive = panel.dataset.menuPanel === target;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  });

  tab.addEventListener("keydown", (event) => {
    const currentIndex = menuTabs.indexOf(tab);
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % menuTabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + menuTabs.length) % menuTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = menuTabs.length - 1;
    }

    menuTabs[nextIndex].focus();
    menuTabs[nextIndex].click();
  });
});

if (reduceMotion || !gsapAvailable) {
  showEverything();
} else {
  const { gsap } = window;
  document.body.classList.add("motion-ready");

  gsap.defaults({
    duration: 0.58,
    ease: "power2.out"
  });

  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".site-header", {
      opacity: 0.86,
      y: -14,
      duration: 0.7
    })
    .from(".hero-media img", {
      scale: 1.08,
      x: 18,
      filter: "saturate(0.72) brightness(0.86)",
      duration: 1.25
    }, 0)
    .from(".hero .kicker", {
      opacity: 0,
      x: -16,
      y: 18,
      duration: 0.5
    }, 0.16)
    .from("#hero-title", {
      opacity: 0,
      x: -18,
      y: 32,
      duration: 0.82
    }, 0.24)
    .from(".hero-copy", {
      opacity: 0,
      x: -12,
      y: 22,
      duration: 0.62
    }, 0.4)
    .from(".hero-actions .button", {
      opacity: 0,
      x: -8,
      y: 14,
      scale: 0.98,
      stagger: 0.07,
      duration: 0.5
    }, 0.55)
    .from(".hero-strip a", {
      opacity: 0,
      y: 16,
      stagger: 0.05,
      duration: 0.5
    }, 0.68);

  document.querySelectorAll(".hero [data-reveal]").forEach((item) => item.classList.add("is-visible"));

  const heroRevealItems = new Set(document.querySelectorAll(".hero [data-reveal]"));
  const revealTargets = revealItems.filter((item) => !heroRevealItems.has(item));

  const detailTargetsFor = (target) => {
    if (target.matches(".story-copy")) {
      return Array.from(target.children);
    }

    if (target.matches(".menu-board")) {
      return Array.from(target.querySelectorAll(".menu-tabs, .menu-panel.is-active > div, .menu-panel.is-active li"));
    }

    if (target.matches(".supplier-ledger")) {
      return Array.from(target.querySelectorAll("div"));
    }

    if (target.matches(".facts-card, .time-table")) {
      return Array.from(target.querySelectorAll("dl div"));
    }

    if (target.matches(".faq-list")) {
      return Array.from(target.querySelectorAll("details"));
    }

    return [];
  };

  const revealProfileFor = (target) => {
    if (target.matches(".story-image, .menu-board, .map-card, .route-card, .facts-card, .supplier-ledger, .time-table, .faq-list")) {
      return {
        from: {
          autoAlpha: 0,
          y: 42,
          scale: 0.986,
          clipPath: "inset(8% 0% 10% 0%)"
        },
        to: {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.82
        }
      };
    }

    return {
      from: {
        autoAlpha: 0,
        y: 28
      },
      to: {
        autoAlpha: 1,
        y: 0,
        duration: 0.62
      }
    };
  };

  const prepareRevealTarget = (target) => {
    const profile = revealProfileFor(target);
    gsap.set(target, {
      ...profile.from,
      willChange: "transform, opacity, clip-path"
    });

    const details = detailTargetsFor(target);
    if (details.length) {
      gsap.set(details, {
        autoAlpha: 0,
        y: 16,
        willChange: "transform, opacity"
      });
    }

    const image = target.matches(".story-image, .map-card, .route-card")
      ? target.querySelector("img, iframe")
      : null;

    if (image) {
      gsap.set(image, {
        scale: 1.055,
        filter: "blur(7px) saturate(0.92)",
        willChange: "transform, filter"
      });
    }
  };

  const runReveal = (target) => {
    const profile = revealProfileFor(target);
    const details = detailTargetsFor(target);
    const image = target.matches(".story-image, .map-card, .route-card")
      ? target.querySelector("img, iframe")
      : null;

    target.classList.add("is-visible");

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
        overwrite: "auto"
      }
    });

    timeline.to(target, {
      ...profile.to,
      clearProps: "transform,opacity,visibility,clipPath,willChange"
    });

    if (image) {
      timeline.to(
        image,
        {
          scale: 1,
          filter: "blur(0px) saturate(1)",
          duration: 1,
          clearProps: "transform,filter,willChange"
        },
        0.02
      );
    }

    if (details.length) {
      timeline.to(
        details,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.44,
          stagger: target.matches(".time-table") ? 0.032 : 0.052,
          clearProps: "transform,opacity,visibility,willChange"
        },
        0.16
      );
    }
  };

  if (revealTargets.length && "IntersectionObserver" in window) {
    revealTargets.forEach(prepareRevealTarget);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runReveal(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -12% 0px" }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach(runReveal);
  }
}
