gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const staggerTitleDefault = 0.015;
const durationTitleDefault = 1.5;
const staggerTextReveal = 0.005;
const durationDefault = 1.2;

/**
* Fire all scripts on page load
*/
function initScript() {
  initSmoothScroll();
  initClock();
  initParallaxEffect();
  initScrollHighlight();
  initStorytellingScroll();
  initTextRevealAnimation();
  zoomInMaskOnScroll();
}

/**
* Smooth scroll with Lenis Scroll
*/
function initSmoothScroll() {
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/**
* Dynamic Paris Clock with Smooth Blinking Colon
*/
function initClock() {
  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const time = new Intl.DateTimeFormat('en-US', options).format(now);

    document.querySelectorAll('[data-clock]').forEach((el) => {
      el.textContent = `Paris, FR - ${time}`;
    });
  }

  updateClock();
  setInterval(updateClock, 10000);
}

/**
* Parallax effect on scroll
*/
function initParallaxEffect() {
  // apply parallax effect to hero section
  const heroSection = document.querySelector('#hero');

  gsap.to("[data-speed-hero]", {
    y: (i, el) => (-1 * parseFloat(el.getAttribute("data-speed-hero"))) * heroSection.offsetHeight,
    ease: "none",
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      scrub: 0,
      invalidateOnRefresh: true
    }
  });
}

/**
* Text highlight on scroll with ScrollTrigger
*/
function initScrollHighlight() {
  const splitElements = document.querySelectorAll('[scroll-highlight]');

  document.fonts.ready.then(() => {
    splitElements.forEach((el) => {
      const split = new SplitText(el, { type: "chars,words" });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'bottom 50%',
          scrub: 1,
        },
        duration: 6,
        opacity: 0.2,
        stagger: 0.2,
        ease: "none",
      })
    });
  });
}

/**
* Storytelling scroll animations
*/
function initStorytellingScroll() {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#storytelling',
      start: 'top top',
      end: '+=400%',
      markers: true,
      pin: true,
      scrub: 0.5
    }
  });

  // Storytelling title reveal animation
  const splitTitle = document.querySelectorAll('.storytelling-title');

  document.fonts.ready.then(() => {
    splitTitle.forEach((el) => {
      const split = new SplitText(el, { type: "chars,words" });

      tl.fromTo(split.chars, {
        opacity: 0,
        yPercent: 100,
        markers: true,
      }, {
        opacity: 1,
        yPercent: 0,
        duration: durationTitleDefault,
        stagger: staggerTitleDefault,
        ease: "power2.out",
      }, 0);
    });
  });

  tl.to('body', {
    duration: 2
  });

  // Storytelling title fade out animation
  document.fonts.ready.then(() => {
    splitTitle.forEach((el) => {
      const split = new SplitText(el, { type: "chars,words" });

      tl.to(split.chars, {
        opacity: 0,
        duration: 0.5,
        stagger: staggerTitleDefault,
        ease: "power2.out",
      });
    });
  });

  tl.to('body', {
    duration: 1
  });
}

/**
* Text reveal animations with scrollTrigger
*/
function initTextRevealAnimation() {
  const splitElements = document.querySelectorAll('[text-reveal]');

  document.fonts.ready.then(() => {
    splitElements.forEach(el => {
      const split = new SplitText(el, {
        type: "chars, words, lines",
        charsClass: "char-js",
        wordsClass: "word-js",
        linesClass: "line-js"
      });

      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: el,
          start: "top 65%",
          toggleActions: "play none none none",
          once: true
        },
        duration: durationDefault,
        opacity: 0,
        yPercent: 100,
        ease: "power4.out",
        stagger: staggerTextReveal,
      });
    });
  });
}

/**
 * Zoom in effect on scroll contact
 */
function zoomInMaskOnScroll() {
  const container = document.querySelector(".masked-img-container");
  const img = document.querySelector(".masked-img");

  let tl = gsap.timeline();

  tl.to(container, {
    scrollTrigger: {
      trigger: "#shape-scroll",
      start: "top top",
      end: "bottom top",
      scrub: true,
      markers: true
    },
    maskSize: "300%",
    webkitMaskSize: "300%",
    ease: "power4.in"
  });

  tl.to(img, {
    scrollTrigger: {
      trigger: "#shape-scroll",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: true,
      markers: true
    },
    scale: 1,
    ease: "none"
  });
}

/**
* Page load actions
*/
initScript();

// On resize, relaunch scrollTrigger
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// }