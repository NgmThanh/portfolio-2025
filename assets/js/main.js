gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const staggerDefault = 0.1;
const staggerTextReveal = 0.005;
const durationDefault = 1.2;

/**
* Fire all scripts on page load
*/
function initScript() {
  initSmoothScroll();
  initScrollHighlight();
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
* Text highlight on scroll with ScrollTrigger
*/
function initScrollHighlight() {
  const splitElements = document.querySelectorAll('[scroll-highlight]');

  splitElements.forEach((element) => {
    const splitText = new SplitText(element, { type: "chars,words" });
    gsap.from(splitText.chars, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 50%',
        scrub: 1,
        markers: false,
      },
      duration: 6,
      opacity: 0.2,
      stagger: 0.2,
      ease: "none"
    })
  });
}

/**
* Text reveal animations with scrollTrigger
*/
function initTextRevealAnimation() {
  document.fonts.ready.then(() => {
    document.querySelectorAll('[text-scroll-appear]').forEach(el => {
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
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scroll-contact',
      start: 'top top',
      end: '+=350%',
      markers: true,
      pin: true,
      scrub: 0.5
    }
  });

  tl.to('body', {
    duration: 0.5
  });

  tl.fromTo('.contact-img', {
    scale: 1.1,
  }, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    scale: 1,
    duration: 2,
    ease: 'none'
  });

  tl.to('.text-scroll', {
    opacity: 0,
    duration: 1,
    ease: 'none'
  }), "<";

  tl.to('body', {
    duration: 1
  });

  // TODO : responsive version
}

/**
* Page load actions
*/
initScript();

// On resize, relaunch horizontal scroll
window.addEventListener("resize", () => {
  initScrollHighlight();
  ScrollTrigger.refresh();
});

// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// }