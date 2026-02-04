// Initialize animations and interactions

document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for fade-up animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-up elements
  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });

  // Feature tabs accordion interaction
  document.querySelectorAll(".feature_component").forEach((component) => {
    const items = [
      ...component.querySelectorAll(".feature-tabs-menu-item"),
    ] as HTMLElement[];
    const images = [
      ...component.querySelectorAll(".feature-image-wrapper"),
    ] as HTMLElement[];

    if (!items.length || !images.length) return;

    function openIndex(idx: number) {
      // Toggle active class on images
      images.forEach((img, i) => img.classList.toggle("active", i === idx));

      // Toggle is-active class on menu items and animate accordion
      items.forEach((item, i) => {
        const bottom = item.querySelector(
          ".feature-tabs-menu-item-bottom"
        ) as HTMLElement | null;
        item.classList.toggle("is-active", i === idx);
        if (!bottom) return;
        bottom.style.overflow = "hidden";
        bottom.style.maxHeight = i === idx ? bottom.scrollHeight + "px" : "0px";
      });
    }

    // Initialize first tab as open
    openIndex(0);

    // Add click handlers
    items.forEach((item, idx) => {
      item.addEventListener("click", () => openIndex(idx));
    });

    // Handle resize to recalculate max-height
    window.addEventListener("resize", () => {
      const activeIdx = items.findIndex((it) =>
        it.classList.contains("is-active")
      );
      if (activeIdx >= 0) {
        const bottom = items[activeIdx].querySelector(
          ".feature-tabs-menu-item-bottom"
        ) as HTMLElement | null;
        if (bottom) bottom.style.maxHeight = bottom.scrollHeight + "px";
      }
    });
  });

  // Mobile menu toggle
  const menuButton = document.querySelector(".menu-button");
  const navMenu = document.querySelector(".nav-menu");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
      navMenu.classList.toggle("is-open");
      menuButton.classList.toggle("is-open");
    });
  }

  // Webflow class detection script
  const html = document.documentElement;
  html.className += " w-mod-js";
  if ("ontouchstart" in window || (window as any).DocumentTouch) {
    html.className += " w-mod-touch";
  }

  // Testimonials slider
  const sliderInstance = document.querySelector(".fs-slider_instance");
  if (sliderInstance) {
    const slides = [
      ...sliderInstance.querySelectorAll(".fs-slider_slide"),
    ] as HTMLElement[];
    const paginationContainer = sliderInstance.querySelector(
      ".fs-slider_pagination"
    );

    if (slides.length > 0 && paginationContainer) {
      let currentIndex = 0;

      // Clear existing pagination bullets and create new ones
      paginationContainer.innerHTML = "";
      slides.forEach((_, index) => {
        const bullet = document.createElement("div");
        bullet.className = "fs-slider_pagination_bullet";
        if (index === 0) bullet.classList.add("is-bullet-active");
        bullet.addEventListener("click", () => goToSlide(index));
        paginationContainer.appendChild(bullet);
      });

      const bullets = [
        ...paginationContainer.querySelectorAll(".fs-slider_pagination_bullet"),
      ] as HTMLElement[];

      function goToSlide(index: number) {
        currentIndex = index;

        // Update slides visibility
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? "block" : "none";
        });

        // Update pagination bullets
        bullets.forEach((bullet, i) => {
          bullet.classList.toggle("is-bullet-active", i === index);
        });
      }

      // Initialize first slide
      goToSlide(0);
    }
  }
});
