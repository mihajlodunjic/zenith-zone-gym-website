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
