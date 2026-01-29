document.addEventListener('DOMContentLoaded', function () {
  /* ==============================
     Carousel Cube
     ============================== */
  const carouselCube = document.querySelector('.carousel-cube');
  if (carouselCube) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    const carouselFaces = document.querySelectorAll('.carousel-face');

    let currentRotation = 0;
    let currentIndex = 0;

    const cubeWidth = carouselCube.offsetWidth;
    const translateZ = cubeWidth / 2;

    carouselFaces.forEach((face) => {
      let angle = 0;
      if (face.classList.contains('front')) angle = 0;
      else if (face.classList.contains('right')) angle = 90;
      else if (face.classList.contains('back')) angle = 180;
      else if (face.classList.contains('left')) angle = -90;
      face.style.transform = `rotateY(${angle}deg) translateZ(${translateZ}px)`;
    });

    function updateCarousel() {
      carouselCube.style.transform = `translateZ(-${translateZ}px) rotateY(${currentRotation}deg)`;
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    }

    nextBtn.addEventListener('click', () => {
      currentRotation -= 90;
      currentIndex = (currentIndex + 1) % carouselFaces.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentRotation += 90;
      currentIndex = (currentIndex - 1 + carouselFaces.length) % carouselFaces.length;
      updateCarousel();
    });

    indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.dataset.slideIndex);
        const rotationDiff = targetIndex - currentIndex;
        currentRotation -= rotationDiff * 90;
        currentIndex = targetIndex;
        updateCarousel();
      });
    });

    updateCarousel();
  }

  /* ==============================
     Header Shrinking, Fading & Sticky Header
     ============================== */
  const mainTitle = document.querySelector('.main-title');
  const subtitle = document.querySelector('.subtitle');
  const headerButtons = document.querySelector('.header-buttons');
  const stickyHeader = document.getElementById('sticky-header');

  if (mainTitle && subtitle && headerButtons) {
    let animationEndScrollY = window.innerHeight * 0.9;

    window.addEventListener('resize', () => {
      animationEndScrollY = window.innerHeight * 0.9;
    });

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      // Calculate the shrink/fade factor. It will be a value from 0 to 1.
      const shrinkFactor = Math.min(scrollY / animationEndScrollY, 1);

      // Shrink main header text completely
      const mainSize = 4 * (1 - shrinkFactor);   // goes from 4rem → 0
      const subSize = 1.8 * (1 - shrinkFactor); // goes from 1.8rem → 0
      mainTitle.style.fontSize = mainSize + "rem";
      subtitle.style.fontSize = subSize + "rem";

      // Scale header buttons completely
      const buttonScale = 1 - shrinkFactor; // goes from 1 → 0
      headerButtons.style.transform = `translateX(-50%) scale(${buttonScale})`;

      // Fade out text and buttons
      const fade = 1 - shrinkFactor; // goes from 1 → 0
      mainTitle.style.opacity = fade;
      subtitle.style.opacity = fade;
      headerButtons.style.opacity = fade;

      // Show sticky header after shrink threshold
      if (shrinkFactor >= 0.5) {
        stickyHeader.classList.add("visible");
      } else {
        stickyHeader.classList.remove("visible");
      }
    });
  }

  /* ==============================
     Smooth Scroll for Header Buttons
     ============================== */
  const navButtons = document.querySelectorAll('button[data-target]');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const stickyNavMenu = document.querySelector('.sticky-nav-menu');

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      stickyNavMenu.classList.toggle('open');
    });
  }

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      if (targetId === 'top') {
        // If menu is open on mobile, close it
        if (stickyNavMenu.classList.contains('open')) {
          stickyNavMenu.classList.remove('open');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        const stickyHeaderHeight = stickyHeader.offsetHeight;
        // If menu is open on mobile, close it
        if (stickyNavMenu.classList.contains('open')) {
          stickyNavMenu.classList.remove('open');
        }
        window.scrollTo({
          top: targetSection.offsetTop - stickyHeaderHeight,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==============================
     Dynamic Carousel Height
     ============================== */
  const projectsBanner = document.getElementById('projects');
  const carouselScene = document.querySelector('.carousel-scene');

  if (projectsBanner && carouselScene) {
    function setCarouselHeight() {
      // Get the current heights of the sticky header and the projects banner
      const stickyHeaderHeight = stickyHeader.offsetHeight;
      const projectsBannerHeight = projectsBanner.offsetHeight;
      // Calculate the remaining viewport height
      const carouselHeight = window.innerHeight - stickyHeaderHeight - projectsBannerHeight;
      // Apply the calculated height to the carousel scene
      carouselScene.style.height = `${carouselHeight}px`;
    }

    window.addEventListener('resize', setCarouselHeight);
    setCarouselHeight(); // Set height on initial load
  }
});
