gsap.registerPlugin(ScrollTrigger, SplitText);

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
  initHorizontalScroll();
  initParallaxServicesBg();
  initServicesItemTransition();
  initPinScrollHighlight();
  initRollingText();
  initMouseTrail();
}

/**
* Smooth scroll with Lenis Scroll
*/
function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    smoothTouch: true,
    mouseMultiplier: 0.8,
    touchMultiplier: 1.5,
    syncTouch: true,
    syncTouchLerp: 0.08,
    touchInertiaMultiplier: 15,
    infinite: false,
  });

  // GSAP and ScrollTrigger integration with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  // Gestion des liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        lenis.scrollTo(target, {
          offset: 0,
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
      }
    })
  });
}

/**
* Works list horizontal scroll
*/
function initHorizontalScroll() {
  const content = gsap.utils.toArray(".horizontal-scroll .horizontal-item");

  // if (window.innerWidth > 767) {
  gsap.to(content, {
    xPercent: -100 * (content.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-scroll",
      pin: true,
      scrub: 0.5,
      start: "top top",
      end: () => `+=${100 * (content.length)}%`,
      invalidateOnRefresh: true,
    },
  });
  // }
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
  const heroBackground = document.querySelector('.hero-img');

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

  gsap.fromTo(heroBackground, {
    filter: "brightness(1)",
  }, {
    filter: "brightness(0.2)",
    ease: "none",
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 0.3,
      invalidateOnRefresh: true
    }
  });
}

/**
* Text highlight on scroll with ScrollTrigger
*/
function initScrollHighlight() {
  const splitElements = document.querySelectorAll('[data-scroll-highlight]');

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
        duration: 3,
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
      end: '+=300%',
      pin: true,
      scrub: 0.5
    }
  });

  const splitTitle = document.querySelectorAll('.storytelling-title');

  document.fonts.ready.then(() => {
    splitTitle.forEach((el) => {
      const split = new SplitText(el, {
        type: "chars, words, lines",
        linesClass: "line-js",
      });

      // Storytelling title reveal animation
      tl.fromTo(split.chars, {
        opacity: 0.4,
        yPercent: 125,
      }, {
        opacity: 1,
        yPercent: 0,
        duration: durationTitleDefault,
        stagger: staggerTitleDefault,
        ease: "power3.out",
      });

      tl.fromTo('.circle-transition', {
        scale: 0,
      }, {
        duration: 2,
        scale: 50,
        ease: "none",
      });
    });
  });
}

/**
 * Services parallax bg setup
 */
function initParallaxServicesBg() {
  gsap.utils.toArray(".services-bg-img").forEach(function (container) {
    let image = container.querySelector(".services-bg-img img");

    gsap.to(image, {
      y: () => image.offsetHeight - container.offsetHeight,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        scrub: true,
        pin: false,
        invalidateOnRefresh: true
      },
    });
  });
}

/**
 * Services item transition on scroll
 */
function initServicesItemTransition() {
  const servicesItems = document.querySelectorAll('.services-item');
  const overlays = document.querySelectorAll('.services-item-overlay');

  servicesItems.forEach((item, index) => {
    if (index === servicesItems.length - 1) return; // Exclude last item
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "bottom bottom",
        end: "+=100%",
        scrub: true,
        onUpdate: self => {
          if (overlays[index]) {
            overlays[index].style.opacity = self.progress;
          }
        },
      },
      scale: 0.85,
      transform: "rotateX(10deg) rotateY(-15deg)",
      ease: "none",
    });
  });
}

/**
 * Text hightlight on scroll with ScrollTrigger (pinned)
 */
function initPinScrollHighlight() {
  const splitElementsPinned = document.querySelectorAll('[data-scroll-highlight-pin]');

  document.fonts.ready.then(() => {
    splitElementsPinned.forEach((el) => {
      const split = new SplitText(el, { type: "chars,words" });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: "#action",
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
        },
        duration: 2,
        opacity: 0.2,
        stagger: 0.2,
        ease: "none",
      })
    });
  });
}

/**
* Rolling text
*/
function initRollingText() {

  let direction = 1; // 1 = forward, -1 = backward scroll

  const roll1 = roll(".rolling-text", { duration: 10 }),
    roll2 = roll(".rollingText02", { duration: 10 }, true),
    scroll = ScrollTrigger.create({
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          gsap.to([roll1, roll2], { timeScale: direction, overwrite: true });
        }
      }
    });

  // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
  function roll(targets, vars, reverse) {
    vars = vars || {};
    vars.ease || (vars.ease = "none");
    const tl = gsap.timeline({
      repeat: -1,
      onReverseComplete() {
        this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
      }
    }),
      elements = gsap.utils.toArray(targets),
      clones = elements.map(el => {
        let clone = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        return clone;
      }),
      positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], { position: "absolute", overwrite: false, top: el.offsetTop, left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth) }));
    positionClones();
    elements.forEach((el, i) => tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0));
    window.addEventListener("resize", () => {
      let time = tl.totalTime(); // record the current time
      tl.totalTime(0); // rewind and clear out the timeline
      positionClones(); // reposition
      tl.totalTime(time); // jump back to the proper time
    });
    return tl;
  }
}

/**
* Contact section mouse trail effect
*/
function initMouseTrail() {
  const images = [
    "assets/img/img1.jpg",
    "assets/img/img2.jpg",
    "assets/img/img3.jpg",
    "assets/img/img4.jpg",
    "assets/img/img5.jpg",
    "assets/img/img6.jpg",
    "assets/img/img7.jpg",
    "assets/img/img8.jpg",
    "assets/img/img9.jpg",
    "assets/img/img10.jpg",
  ];

  const container = document.querySelector("#contact");

  let currentImageIndex = 0;
  let lastX = 0;
  let lastY = 0;
  let distanceThreshold = 200; // Distance threshold to change image

  container.addEventListener("mousemove", (event) => {
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > distanceThreshold) {
      createImageTrail(event.clientX, event.clientY);
      lastX = event.clientX;
      lastY = event.clientY;
    }
  });

  function createImageTrail(x, y) {
    const img = document.createElement("img");
    img.src = images[currentImageIndex];
    img.classList.add("image-trail");
    container.appendChild(img);
    currentImageIndex = (currentImageIndex + 1) % images.length;

    gsap.set(img, {
      x: x - img.width / 2,
      y: y - img.height / 2,
      scale: 0,
      opacity: 0,
      rotation: gsap.utils.random(-20, 20),
    });

    gsap.to(img, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(img, {
      scale: 0,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power2.in",
      onComplete: () => {
        img.remove();
      }
    });
  }
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
