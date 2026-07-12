import { site } from '../config/site.js';

export function renderNotFound() {
  return `
  <a class="skip-link" href="#main-content">Pređi na glavni sadržaj</a>
  <main id="main-content" class="not-found-page">
    <div class="shell not-found-layout">
      <p class="eyebrow">404 / STRANICA NIJE PRONAĐENA</p>
      <h1>Traženi sadržaj nije dostupan.</h1>
      <p class="hero-intro">Vrati se na početnu stranu Zenith Zone Gym sajta ili pošalji upit putem zvaničnog Instagram profila.</p>
      <div class="hero-actions">
        <a class="button-primary" href="/">Nazad na početnu</a>
        <a class="text-link" href="${site.instagramUrl}" target="_blank" rel="noreferrer noopener">Pošalji upit</a>
      </div>
    </div>
  </main>`;
}
