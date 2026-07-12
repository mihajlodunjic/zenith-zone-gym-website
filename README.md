# Zenith Zone Gym website

Statički produkcijski sajt za Zenith Zone Gym, pripremljen za Render Static Site deploy i generisanje pravog HTML sadržaja bez client-side renderovanja.

## Stack

- Custom static build sa Node.js skriptama
- Semantički HTML + lokalni CSS + mali pristupačan JavaScript za meni i FAQ
- Self-hosted `Barlow` i `Barlow Condensed` fontovi preko `@fontsource`

## Komande

```bash
npm install
npm run build
npm run lint
npm run test
npm run preview
```

`npm run preview` podiže lokalni server za sadržaj iz `dist/` na `http://localhost:4173`.

## Render deploy

- Build command: `npm run build`
- Publish directory: `dist`
- Blueprint fajl: [`render.yaml`](/D:/programiranje/zenith zone gym/frontend/render.yaml)

`SITE_URL` treba postaviti u Render okruženju na javni domen sajta, na primer `https://example.com`. Kada nije postavljen:

- canonical tag se ne generiše;
- `sitemap.xml` ostaje prazan osim napomene;
- `robots.txt` ne objavljuje apsolutnu sitemap adresu.

## Projekat

- Glavna stranica: [`dist/index.html`](/D:/programiranje/zenith zone gym/frontend/dist/index.html)
- Statička 404 stranica: [`dist/404.html`](/D:/programiranje/zenith zone gym/frontend/dist/404.html)
- Glavni stilovi: [`src/styles/main.css`](/D:/programiranje/zenith zone gym/frontend/src/styles/main.css)
- Build skripta: [`scripts/build.mjs`](/D:/programiranje/zenith zone gym/frontend/scripts/build.mjs)

## Napomene

- Nisu korišćene stock fotografije.
- Logo ostaje neizmenjen i koristi se direktno iz `public/logo.png`.
- Za kontakt CTA trenutno se koristi zvanični Instagram profil, jer telefon, email i forma nisu potvrđeni.
