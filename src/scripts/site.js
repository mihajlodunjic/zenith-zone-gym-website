const root = document.documentElement;
const menuToggle = document.querySelector('[data-menu-toggle]');
const siteNav = document.querySelector('[data-site-nav]');
const navLinks = siteNav ? [...siteNav.querySelectorAll('a')] : [];

function closeMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'false');
  root.removeAttribute('data-menu-open');
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    root.toggleAttribute('data-menu-open', !expanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

const faqTriggers = [...document.querySelectorAll('[data-faq-trigger]')];

faqTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;

    if (!panel) {
      return;
    }

    faqTriggers.forEach((item) => {
      const currentPanelId = item.getAttribute('aria-controls');
      const currentPanel = currentPanelId ? document.getElementById(currentPanelId) : null;

      item.setAttribute('aria-expanded', 'false');

      if (currentPanel) {
        currentPanel.hidden = true;
      }
    });

    if (!expanded) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});

const galleryRoot = document.querySelector('[data-gallery]');

if (galleryRoot) {
  const galleryTrack = galleryRoot.querySelector('[data-gallery-track]');
  const gallerySlides = galleryTrack ? [...galleryTrack.querySelectorAll('[data-gallery-slide]')] : [];
  const previousButton = galleryRoot.querySelector('[data-gallery-prev]');
  const nextButton = galleryRoot.querySelector('[data-gallery-next]');
  const currentValue = galleryRoot.querySelector('[data-gallery-current]');
  let activeIndex = 0;

  const updateGallery = () => {
    if (!galleryTrack || !previousButton || !nextButton || !currentValue) {
      return;
    }

    galleryTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === gallerySlides.length - 1;
    currentValue.textContent = String(activeIndex + 1).padStart(2, '0');

    gallerySlides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
    });
  };

  const moveGallery = (direction) => {
    const nextIndex = activeIndex + direction;

    if (nextIndex < 0 || nextIndex >= gallerySlides.length) {
      return;
    }

    activeIndex = nextIndex;
    updateGallery();
  };

  previousButton?.addEventListener('click', () => {
    moveGallery(-1);
  });

  nextButton?.addEventListener('click', () => {
    moveGallery(1);
  });

  galleryRoot.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveGallery(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveGallery(1);
    }
  });

  updateGallery();
}
