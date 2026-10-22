# TEMPO

A mobile-first personal time companion. This edition is a static React app for GitHub Pages, with the existing TEMPO design, routine editing, tracking, insights, interruption previews, local fonts, and offline support.

## Publish on GitHub Pages

1. Create a repository, normally named `tempo`, with `main` as the default branch.
2. Upload this folder's contents to the repository root, including `.github/workflows/pages.yml` and `.gitignore`. Do not upload `node_modules` or `dist`.
3. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
4. Open **Actions → Publish TEMPO to GitHub Pages → Run workflow**. Future pushes to `main` publish automatically.
5. Once deployment succeeds, Settings → Pages displays the live URL.

The workflow obtains the correct repository path automatically. It supports project paths such as `https://YOUR-USERNAME.github.io/tempo/` and root/custom-domain sites. No personal access token is needed in the workflow.

GitHub Pages may be publicly accessible. Do not add personal backups or tracking exports to the repository. The default routine is included in the source.

## Local use

Use Node.js 24. Run `npm ci`, then `npm run dev`. `npm run check`, `npm test`, and `npm run build` verify the app. `npm run preview` serves the build.

To test a project path in PowerShell:

```powershell
$env:PAGES_BASE_PATH='/tempo/'
npm run build
npm run preview
```

## Data and reminders

Settings, schedules, and tracking records remain in the browser's IndexedDB. GitHub hosting does not synchronize or upload them. Existing localhost data does not automatically appear on the new origin: export a local backup, then restore it in the hosted app.

The service worker caches the complete production build, including fonts, after an online visit. On iPhone use Safari → Share → Add to Home Screen.

Foreground reminders work while the app is open. Reliable iOS background notifications require a future push service; GitHub Pages does not supply one.
