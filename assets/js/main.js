gsap.registerPlugin(ScrollTrigger, SplitText);

const staggerTitleDefault = 0.015;
const durationTitleDefault = 1.5;
const staggerTextReveal = 0.005;
const durationDefault = 1.2;

/**
* Fire all scripts on page load
*/
function initScript() {
  // initSmoothScroll();
  initClock();
  initParallaxEffect();
  initScrollHighlight();
  initStorytellingScroll();
  initHorizontalScroll();
  initPinScrollHighlight();
  initRollingText();
}

/**
* Smooth scroll with Lenis Scroll
*/
// function initSmoothScroll() {
const lenis = new Lenis({
  duration: 1.2,
  smooth: true,
  smoothTouch: true,
  mouseMultiplier: 0.8,
  touchMultiplier: 1.2,
  syncTouch: true,
  syncTouchLerp: 0.08,
  touchInertiaMultiplier: 12,
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
// }

/**
* Works list horizontal scroll
*/
function initHorizontalScroll() {
  const content = gsap.utils.toArray(".horizontal-scroll .horizontal-item");

  if (window.innerWidth > 767) {
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
  }
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
      end: '+=400%',
      markers: true,
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
          end: '+=300%',
          scrub: 1,
          pin: true,
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


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.querySelector(".model").appendChild(renderer.domElement);

let lights = {};

// Key light - strong directional from upper left (mimicking the photo)
lights.key = new THREE.DirectionalLight(0xfff8e7, 2.5);
lights.key.position.set(-4, 6, 3);
lights.key.castShadow = true;
lights.key.shadow.mapSize.width = 4096;
lights.key.shadow.mapSize.height = 4096;
lights.key.shadow.camera.near = 1;
lights.key.shadow.camera.far = 20;
lights.key.shadow.camera.left = -5;
lights.key.shadow.camera.right = 5;
lights.key.shadow.camera.top = 5;
lights.key.shadow.camera.bottom = -5;
lights.key.shadow.bias = -0.0005;
lights.key.shadow.radius = 8;
scene.add(lights.key);

// Fill light - softer from right side
lights.fill = new THREE.DirectionalLight(0xe8f4ff, 0.9);
lights.fill.position.set(3, 2, 2);
scene.add(lights.fill);

// Rim light - from behind to separate from background
lights.rim = new THREE.DirectionalLight(0xffffff, 0.8);
lights.rim.position.set(1, 4, -3);
scene.add(lights.rim);

// Very subtle ambient
lights.ambient = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(lights.ambient);

// Hidden dramatic light for special effects
lights.dramatic = new THREE.SpotLight(0xffffff, 0, 15, Math.PI / 4, 0.3);
lights.dramatic.position.set(-2, 5, 4);
lights.dramatic.castShadow = true;
scene.add(lights.dramatic);

function basicAnimate() {
  renderer.render(scene, camera);
  requestAnimationFrame(basicAnimate);
}
basicAnimate();

let model;
const loader = new THREE.GLTFLoader();
loader.load("./assets/model/david.glb", function (gltf) {
  model = gltf.scene;
  model.traverse((node) => {
    if (node.isMesh) {
      if (node.material) {
        node.material = new THREE.MeshPhongMaterial({
          color: 0xf8f6f0,
          shininess: 15,
          specular: 0x222222,
          transparent: false
        });
      }
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  scene.add(model);

  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.z = maxDim * 2;
  camera.position.y = maxDim * 0.7;


  // model.scale.set(0, 0, 0);
  model.scale.set(2, 2, 2)
  model.scale.set(1.75, 1.75, 1.75)

  model.rotation.set(0, 0.5, 0);

  // playInitialAnimation();

  cancelAnimationFrame(basicAnimate);
  animate();
});

const floatAmplitude = 0.2;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let isFloating = true;
let currentScroll = 0;

const totalScrollHeight =
  document.documentElement.scrollHeight - window.innerHeight;

function playInitialAnimation() {
  if (model) {
    gsap.to(model.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 1,
      ease: "power2.out",
    });
  }
}

lenis.on("scroll", (e) => {
  currentScroll = e.scroll;
});

function animate() {
  if (model) {
    if (isFloating) {
      const floatOffset =
        Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
      model.position.y = floatOffset;
    }

    const scrollProgress = Math.min(currentScroll / totalScrollHeight, 1);

    const baseTilt = 0.5;
    model.rotation.y = scrollProgress * Math.PI * 6 + baseTilt;
    // set camera position with this pattern : middle then left, then middle position

  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}