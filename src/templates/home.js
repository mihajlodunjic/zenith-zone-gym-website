import { site } from '../config/site.js';

function renderExternalCta(label, className = 'button-primary') {
  return `<a class="${className}" href="${site.instagramUrl}" target="_blank" rel="noreferrer noopener">${label}</a>`;
}

function renderTextLink(label, href) {
  return `<a class="text-link" href="${href}">${label}</a>`;
}

function renderSectionLabel(label) {
  return `<div class="section-label"><span>${label}</span><span class="section-label-line" aria-hidden="true"></span></div>`;
}

function renderProcessRows() {
  return site.process.steps
    .map(
      ({ step, title, copy }) => `
      <li class="process-row">
        <div class="process-number" aria-hidden="true">${step}</div>
        <div class="process-body">
          <h3>${title}</h3>
          <p>${copy}</p>
        </div>
      </li>`
    )
    .join('');
}

function renderFaqRows() {
  return site.faq.items
    .map(
      ({ id, question, answer }, index) => `
      <div class="faq-row">
        <h3>
          <button
            class="faq-trigger"
            type="button"
            aria-expanded="${index === 0 ? 'true' : 'false'}"
            aria-controls="${id}"
            id="${id}-trigger"
            data-faq-trigger
          >
            <span>${question}</span>
            <span class="faq-icon" aria-hidden="true"></span>
          </button>
        </h3>
        <div
          class="faq-panel"
          id="${id}"
          role="region"
          aria-labelledby="${id}-trigger"
          ${index === 0 ? '' : 'hidden'}
        >
          <p>${answer}</p>
        </div>
      </div>`
    )
    .join('');
}

function renderNavLinks() {
  return site.navItems
    .map(({ href, label }) => `<a href="${href}">${label}</a>`)
    .join('');
}

export function renderHome(currentYear) {
  return `
  <a class="skip-link" href="#main-content">Pređi na glavni sadržaj</a>
  <div class="site-frame">
    <header class="site-header" data-site-header>
      <div class="shell header-inner">
        <a class="brand-mark" href="#top" aria-label="Zenith Zone Gym početna strana">
          <img src="/logo.png" alt="Zenith Zone Gym logo" width="1254" height="1254">
        </a>
        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="primary-navigation"
          data-menu-toggle
        >
          <span class="menu-toggle-text">Meni</span>
          <span class="menu-toggle-lines" aria-hidden="true"></span>
        </button>
        <nav class="site-nav" id="primary-navigation" aria-label="Glavna navigacija" data-site-nav>
          <div class="site-nav-links">
            ${renderNavLinks()}
          </div>
          ${renderExternalCta(site.hero.primaryCta, 'button-primary nav-cta')}
        </nav>
      </div>
    </header>

    <main id="main-content">
      <section class="hero-section" id="top">
        <div class="shell hero-grid">
          <div class="hero-rail">
            <p class="rail-label">${site.hero.metadata}</p>
            <p class="rail-note">Projektovan napredak</p>
          </div>
          <div class="hero-copy">
            <p class="eyebrow">${site.hero.status}</p>
            <h1>${site.hero.title}</h1>
            <p class="hero-intro">${site.hero.intro}</p>
            <div class="hero-actions">
              ${renderExternalCta(site.hero.primaryCta)}
              ${renderTextLink(site.hero.secondaryCta, '#sistem')}
            </div>
          </div>
          <div class="hero-system" aria-label="Prikaz načina rada">
            <div class="hero-system-bar">
              <span>ZENITH / SOPOT / EST. 2020</span>
              <span>NIJE OPEN GYM</span>
            </div>
            <div class="hero-system-grid">
              <div class="hero-system-word" aria-hidden="true">NAPREDAK</div>
              <ol class="hero-stages">
                <li><span>01</span><strong>Upit</strong></li>
                <li><span>02</span><strong>Dogovor</strong></li>
                <li><span>03</span><strong>Plan</strong></li>
                <li><span>04</span><strong>Trening</strong></li>
              </ol>
              <svg class="gear-outline hero-gear" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
                <path d="M56 6l3 10a35 35 0 0 1 9 4l9-5 8 8-5 9a35 35 0 0 1 4 9l10 3v12l-10 3a35 35 0 0 1-4 9l5 9-8 8-9-5a35 35 0 0 1-9 4l-3 10H44l-3-10a35 35 0 0 1-9-4l-9 5-8-8 5-9a35 35 0 0 1-4-9L6 56V44l10-3a35 35 0 0 1 4-9l-5-9 8-8 9 5a35 35 0 0 1 9-4l3-10Z M50 35a15 15 0 1 0 0 30a15 15 0 0 0 0-30Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section class="status-strip" aria-label="Glavna statusna poruka">
        <div class="shell">
          <p>${site.strip}</p>
        </div>
      </section>

      <section class="section section-offwhite" id="nacin-rada">
        <div class="shell">
          ${renderSectionLabel(site.method.label)}
          <div class="method-grid">
            <div class="method-head">
              <h2>${site.method.title}</h2>
            </div>
            <div class="method-copy">
              <p class="lead">${site.method.copy}</p>
            </div>
            <div class="method-emphasis">
              <p>${site.method.emphasis}</p>
            </div>
            <ul class="method-notes">
              ${site.method.notes.map((note) => `<li>${note}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>

      <section class="section section-white" id="trening-uzivo">
        <div class="shell">
          ${renderSectionLabel(site.liveTraining.label)}
          <div class="service-split service-split-live">
            <div class="service-copy">
              <h2>${site.liveTraining.title}</h2>
              <p class="lead">${site.liveTraining.copy}</p>
              <p>${site.liveTraining.detail}</p>
              ${renderExternalCta(site.liveTraining.cta)}
            </div>
            <aside class="service-aside">
              <p class="aside-kicker">UŽIVO / SOPOT</p>
              <p class="aside-stat">Direktan rad uz trenera, bez prepuštanja treninga slučaju.</p>
              <div class="aside-meta">
                <span>Personalni trening</span>
                <span>Stručni nadzor</span>
                <span>Vođeno izvođenje</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="section section-dark" id="online-coaching">
        <div class="shell">
          ${renderSectionLabel(site.onlineCoaching.label)}
          <div class="service-split service-split-online">
            <div class="system-panel">
              <div class="system-panel-top">
                <span>ONLINE</span>
                <span>PLAN U APLIKACIJI</span>
              </div>
              <div class="system-panel-body">
                <div>
                  <strong>Na daljinu</strong>
                  <p>Online saradnja zadržava strukturu rada i kada nisi u Sopotu.</p>
                </div>
                <div>
                  <strong>Jasan sled</strong>
                  <p>Sledeći korak je unapred postavljen umesto da zavisi od improvizacije.</p>
                </div>
              </div>
            </div>
            <div class="service-copy inverted">
              <h2>${site.onlineCoaching.title}</h2>
              <p class="lead">${site.onlineCoaching.copy}</p>
              <p>${site.onlineCoaching.detail}</p>
              ${renderExternalCta(site.onlineCoaching.cta)}
            </div>
          </div>
        </div>
      </section>

      <section class="section section-ink" id="sistem">
        <div class="shell">
          ${renderSectionLabel(site.process.label)}
          <div class="process-layout">
            <div class="process-intro">
              <h2>${site.process.title}</h2>
              <p class="lead">${site.process.intro}</p>
              <p>${site.process.outro}</p>
            </div>
            <ol class="process-list">
              ${renderProcessRows()}
            </ol>
          </div>
        </div>
      </section>

      <section class="section section-offwhite" id="aplikacija">
        <div class="shell">
          ${renderSectionLabel(site.app.label)}
          <div class="app-layout">
            <div class="app-copy">
              <h2>${site.app.title}</h2>
              <p class="lead">${site.app.copy}</p>
              <p>${site.app.note}</p>
            </div>
            <figure class="app-figure">
              <figcaption class="app-caption">PLAN / APLIKACIJA / SLEDEĆI KORAK</figcaption>
              <div class="app-sheet">
                <div class="app-sheet-bar">
                  <span>ZENITH</span>
                  <span>SISTEM RADA</span>
                </div>
                <div class="app-sheet-body">
                  <div class="app-sheet-step">
                    <span>01</span>
                    <strong>Cilj i način rada</strong>
                  </div>
                  <div class="app-sheet-step">
                    <span>02</span>
                    <strong>Plan dostupan u aplikaciji</strong>
                  </div>
                  <div class="app-sheet-step">
                    <span>03</span>
                    <strong>Sledeći trening jasno postavljen</strong>
                  </div>
                </div>
                <p class="app-sheet-note">Aplikacija je prikazana kao deo sistema, bez izmišljanja nepostojećeg interfejsa.</p>
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section class="section section-white" id="pitanja">
        <div class="shell faq-layout">
          <div class="faq-head">
            ${renderSectionLabel(site.faq.label)}
            <h2>${site.faq.title}</h2>
          </div>
          <div class="faq-list" data-faq-root>
            ${renderFaqRows()}
          </div>
        </div>
      </section>

      <section class="section section-dark contact-section" id="kontakt">
        <div class="shell contact-layout">
          <div class="contact-copy">
            ${renderSectionLabel(site.contact.label)}
            <h2>${site.contact.title}</h2>
            <p class="lead">${site.contact.copy}</p>
            ${renderExternalCta(site.contact.cta)}
          </div>
          <ul class="contact-tags" aria-label="Osnovne informacije">
            ${site.contact.tags.map((tag) => `<li>${tag}</li>`).join('')}
          </ul>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="shell footer-layout">
        <div class="footer-brand">
          <img src="/logo.png" alt="Zenith Zone Gym logo" width="1254" height="1254">
          <p>Zenith Zone Gym</p>
        </div>
        <div class="footer-index">
          <div>
            <span class="footer-label">LOKACIJA</span>
            <p>Sopot</p>
          </div>
          <div>
            <span class="footer-label">MODEL RADA</span>
            <p>Trening uživo</p>
            <p>Online coaching</p>
          </div>
          <div>
            <span class="footer-label">KONTAKT</span>
            <a href="${site.instagramUrl}" target="_blank" rel="noreferrer noopener">Instagram</a>
          </div>
          <div>
            <span class="footer-label">INDEKS</span>
            ${site.navItems.map(({ href, label }) => `<a href="${href}">${label}</a>`).join('')}
          </div>
        </div>
        <div class="footer-meta">
          <span>EST. ${site.established}</span>
          <span>© ${currentYear}</span>
        </div>
      </div>
    </footer>
  </div>`;
}
