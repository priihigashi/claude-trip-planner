# trip-planner

Family trip guides, one folder per trip. Each trip is a single page you open on a phone while standing on a street corner: live map, live weather, hours, prices, ratings, backups, and tap-to-call.

**Live site:** https://priihigashi.github.io/trip-planner/

## Structure

```
/                       hub page listing every trip
/assets/trip.css        shared styles (all trips)
/assets/trip.js         shared engine (map, filters, weather, distance, detail sheet)
/<trip-slug>/index.html thin shell, loads the two assets + its own data
/<trip-slug>/trip-data.js  ALL trip-specific content lives here
```

## Adding a trip

1. Copy an existing trip folder, rename it `<destination>-<year>`.
2. Replace `trip-data.js`. Nothing else needs editing.
3. Add a card to the root `index.html`.

## trip-data.js shape

```js
window.TRIP = {
  title: "St. ",            // small first line of the wordmark
  accent: "Augustine",       // italic accent word
  eyebrow: "Ship's log \u00b7 1565",
  lat: 29.8947, lng: -81.3145,   // weather + initial map centre
  days: [{
    id: "fri", label: "Fri \u00b7 today",
    note: "One line on how the day is shaped.",
    stops: [{
      t: "9:00",            // display time
      name: "Place name",
      type: "Category line",
      what: "One line shown on the card.",
      blurb: "A paragraph shown in the popup.",
      hours: "9:00 AM \u2013 5:00 PM",
      price: "$30 adult",
      rating: "4.7", count: "38,320",
      addr: "11 S Castillo Dr",
      phone: "9048296506",         // digits only, optional
      q: "Google Maps search text",
      pid: "ChIJ...",              // Google place id, optional
      lat: 29.89, lng: -81.31,
      walk: "5-min walk", dur: "75 min",
      key: 1,                      // gold = don't miss
      opt: 1,                      // dashed = skippable
      tags: ["history","kids"],    // drives the filter chips
      flag: "Shown as an orange warning box.",
      alts: [{ n: "Backup name", d: "why", q: "maps text", id: "ChIJ..." }]
    }]
  }]
};
```

## Filters

Chips are built from tags: `food`, `coffee`, `rest`, `history`, `kids`, `free`. `To book` is automatic for any stop with a `flag`.

## Dependencies

- [Leaflet](https://leafletjs.com/) + OpenStreetMap tiles, from unpkg CDN
- [Open-Meteo](https://open-meteo.com/) for weather, no API key
- Google Fonts (Fraunces, Public Sans, IBM Plex Mono)

No build step. No framework. Open the HTML file and it works.

## Privacy

This repo is public, so trip data must stay shareable:

- No booking confirmation numbers, reservation names, or ticket barcodes
- No hotel room numbers; keep lodging generic ("home base") rather than naming where the family sleeps
- No home address, phone numbers of family members, or household details
- The "Show how far" button reads location in the browser only. It is never stored, logged, or transmitted — distances are computed client-side and vanish on refresh.

## Licence

Personal project. Place data © Google, map tiles © OpenStreetMap contributors.
