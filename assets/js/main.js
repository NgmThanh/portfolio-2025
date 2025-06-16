gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

const staggerDefault = 0.1;
const staggerTextReveal = 0.005;
const durationDefault = 1.2;

/**
* Fire all scripts on page load
*/
function initScript() {
  initScrollHighlight();
  initTextRevealAnimation();
  zoomInMaskOnScroll();
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
        scrub: 1.1,
        markers: false
      },
      duration: 6,
      opacity: 0.2,
      stagger: 0.3,
      ease: "power3.inOut"
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
  gsap.to(".text-scroll", {
    scale: 200,
    scrollTrigger: {
      trigger: "#scroll-contact",
      scrub: 1,
      pin: true,
      start: "top top",
      end: "+=1000",
      ease: "none"
    },
  });
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

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}