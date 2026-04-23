# CAT · DB — Stuffed Feline Suspect Database

A children's web app (React + Vite) for managing a spy-themed database of stuffed cats. Designed for a 7-year-old on a 7" Android tablet in landscape orientation.

## Run / Build

```bash
npm run dev            # dev server at http://localhost:5173
npm run dev -- --host  # expose to network (tablet access)
npm run build          # production build → dist/
npm run preview        # serve the built dist/
```

## Project structure

```
cat-db/
  src/
    main.jsx              # entry point
    App.jsx               # routing (state machine), Settings modal
    store.jsx             # Context + localStorage persistence, export/import
    index.css             # global styles, CSS animations, cork/paper textures
    data/seeds.js         # 8 seed cats (Mr. Mittens, Whiskers, etc.)
    components/ui.jsx     # shared primitives: Stamp, Paw, DangerPaws, TW, HW,
                          #   Mugshot, WBox, WLine, Tape, Paperclip, StatusBadge,
                          #   resizePhoto (base64 resize util)
    screens/
      Home.jsx            # Case Board — corkboard + list toggle
      Dossier.jsx         # Manila folder dossier (DossierA style)
      Search.jsx          # Filter rail + live search (SearchB style)
      AddEdit.jsx         # Add/Edit form with camera capture
      Scanner.jsx         # Animated paw-scanner modal (CAPTURE! flow)
```

## Design system

Wireframes are in `/tmp/stuffed_cat_design/` (extracted from design bundle during session). The implemented screens map to:
- Home: wireframe HomeA (corkboard) + HomeB (list) combined with shared header
- Dossier: wireframe DossierA (manila folder)
- Search: wireframe SearchB (visual filter rail)
- Add/Edit: wireframe AddA (form)
- Scanner: wireframe Scanner (paw-print capture moment)

Colors: `#e8dfc9` manila · `#1a1614` ink · `#b8352e` red stamp · `#1e3a5f` blue pen  
Fonts: Special Elite (typewriter) · Caveat (handwritten) · Courier Prime — via Google Fonts

## Data model

```js
{
  id: string,           // 'cat-{timestamp}' or seed id
  name: string,
  alias: string,
  threat: 1–5,          // danger rating shown as paw prints
  crime: string,
  location: string,
  status: 'AT LARGE' | 'CAPTURED' | 'MOST WANTED' | 'UNDER WATCH',
  notes: string,
  associates: string[], // ids of other cats
  photo: string|null,   // base64 JPEG, resized to ≤400px
  createdAt: ISO string,
}
```

Stored in `localStorage` under key `cat-db-v1` as `{ cats: [...] }`.  
Export → `cat-db-backup-YYYY-MM-DD.json` via ⚙ Settings modal.  
Import → loads from any exported JSON, replaces current data.

## Navigation (state machine in App.jsx)

```
home ←→ dossier ←→ edit
home → add → dossier (after save)
home → search → dossier
dossier: tap CAPTURE! → Scanner overlay → updates status → back to dossier
```

## Key implementation notes

- **Corkboard layout**: absolute positioning via `getCorkPos(idx, id)` in `Home.jsx`. Cards placed in a 4-column grid with deterministic pseudo-random ±11px offsets and ±5° rotation seeded from the cat's id. Red string SVG connections are drawn between associates using the same formula.
- **Scanner animation**: CSS keyframe animations defined in `index.css` (`scanline`, `fill-bar`, `pulse-ring`, `stamp-drop`). Applied via class names. Timer: 2.5s scanning → confirmed → 1.3s → `onComplete` called.
- **Photo capture**: `<input type="file" accept="image/*" capture="environment">` — opens rear camera on Android. Resized to 400px max via `resizePhoto()` canvas util before storing as base64.
- **Associate selector in AddEdit**: multi-toggle of existing cats' mugshot thumbnails.
- **Red strings on corkboard**: SVG overlay drawn at z-index 1, cards at z-index 2. Connections only drawn once per pair (deduped by sorted-id key).

## Known gaps / potential next steps

- **Offline fonts**: Google Fonts requires network; bundle fonts locally for true offline use
- **Tablet orientation lock**: no screen-orientation lock implemented; add via Web App Manifest if needed
- **Photo storage limit**: base64 photos in localStorage; ~20-30 cats with photos should be fine (~5MB limit)
- **Associate display in Dossier**: shows mugshot thumbnails but they are not tappable (could navigate to that cat's dossier)
- **MOST WANTED badge**: not auto-promoted; agent sets status manually
- **Animations**: scanner uses CSS classes; no Framer Motion or similar
