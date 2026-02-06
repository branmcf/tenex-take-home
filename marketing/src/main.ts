// Initialize animations and interactions

//Intersection Observer for fade-up animations
document.addEventListener("DOMContentLoaded", () => {
  // Set up fade-up animations using Intersection Observer
  // This makes elements with .fade-up class animate in when they scroll into view
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1, // Trigger when 10% of element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add visible class to trigger CSS animation
        entry.target.classList.add("is-visible");
        // Stop observing this element once it's animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Find all elements that should fade up and start observing them
  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });

  // Set up feature tabs accordion interaction
  // Each feature component has clickable tabs that show/hide content
  document.querySelectorAll(".feature_component").forEach((component) => {
    // Get all the tab buttons and corresponding images
    const items = [
      ...component.querySelectorAll(".feature-tabs-menu-item"),
    ] as HTMLElement[];
    const images = [
      ...component.querySelectorAll(".feature-image-wrapper"),
    ] as HTMLElement[];

    // Skip if we don't have both tabs and images
    if (!items.length || !images.length) return;

    // Function to open a specific tab by index
    function openIndex(idx: number) {
      // Show the correct image for this tab
      images.forEach((img, i) => img.classList.toggle("active", i === idx));

      // Update tab states and animate the accordion content
      items.forEach((item, i) => {
        const bottom = item.querySelector(
          ".feature-tabs-menu-item-bottom"
        ) as HTMLElement | null;
        
        // Mark this tab as active or inactive
        item.classList.toggle("is-active", i === idx);
        
        if (!bottom) return;
        
        // Animate the accordion content open/closed
        bottom.style.overflow = "hidden";
        bottom.style.maxHeight = i === idx ? bottom.scrollHeight + "px" : "0px";
      });
    }

    // Start with the first tab open
    openIndex(0);

    // Add click handlers to each tab
    items.forEach((item, idx) => {
      item.addEventListener("click", () => openIndex(idx));
    });

    // Handle window resize - need to recalculate accordion heights
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

  // Set up mobile menu toggle
  // Clicking the hamburger button opens/closes the navigation menu
  const menuButton = document.querySelector(".menu-button");
  const navMenu = document.querySelector(".nav-menu");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
      // Toggle open state on both menu and button
      navMenu.classList.toggle("is-open");
      menuButton.classList.toggle("is-open");
    });
  }

  // Add Webflow-compatible classes to HTML element
  // This mimics what Webflow's JavaScript does for compatibility
  const html = document.documentElement;
  html.className += " w-mod-js"; // Indicates JavaScript is enabled
  
  // Add touch class if device supports touch
  if ("ontouchstart" in window || (window as any).DocumentTouch) {
    html.className += " w-mod-touch";
  }

  // Set up testimonials slider
  // This creates a simple slider with pagination bullets
  const sliderInstance = document.querySelector(".fs-slider_instance");
  if (sliderInstance) {
    // Get all the slides
    const slides = [
      ...sliderInstance.querySelectorAll(".fs-slider_slide"),
    ] as HTMLElement[];
    const paginationContainer = sliderInstance.querySelector(
      ".fs-slider_pagination"
    );

    if (slides.length > 0 && paginationContainer) {
      let currentIndex = 0;

      // Create pagination bullets - one for each slide
      paginationContainer.innerHTML = "";
      slides.forEach((_, index) => {
        const bullet = document.createElement("div");
        bullet.className = "fs-slider_pagination_bullet";
        // First bullet starts active
        if (index === 0) bullet.classList.add("is-bullet-active");
        // Clicking a bullet goes to that slide
        bullet.addEventListener("click", () => goToSlide(index));
        paginationContainer.appendChild(bullet);
      });

      const bullets = [
        ...paginationContainer.querySelectorAll(".fs-slider_pagination_bullet"),
      ] as HTMLElement[];

      // Function to switch to a specific slide
      function goToSlide(index: number) {
        currentIndex = index;

        // Hide all slides except the active one
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? "block" : "none";
        });

        // Update which pagination bullet is active
        bullets.forEach((bullet, i) => {
          bullet.classList.toggle("is-bullet-active", i === index);
        });
      }

      // Start with the first slide visible
      goToSlide(0);
    }
  }
});
