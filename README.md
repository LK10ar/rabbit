# Inner Circle

Landing page mono-écran, pilotée au scroll avec gestes custom (aucun scroll natif).

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrez l'URL affichée (par défaut http://localhost:5173).

## Build de production

```bash
npm run build
npm run preview
```

## Notes

- Les deux vidéos sont chargées depuis Cloudflare R2 (URLs codées en dur dans
  `VideoScrubber.tsx` et `SecondVideoScrubber.tsx`).
- Les logos partenaires (Voiceflow, Zendesk, Pendo, Glide, Canva) sont chargés
  depuis un dépôt GitHub externe — si les URLs changent, mettez-les à jour
  dans `App.tsx` (`LOGO_URLS`).
- `GoogleWordmark` / `GithubWordmark` dans `Logos.tsx` sont des wordmarks SVG
  simplifiés (texte stylisé) — remplacez-les par vos propres tracés SVG exacts
  si nécessaire.
- Testé pour React 19 + Vite 6 + Tailwind CSS v4 (plugin `@tailwindcss/vite`).
