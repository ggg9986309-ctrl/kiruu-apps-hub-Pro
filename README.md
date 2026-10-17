# KIRUU APPS HUB

A responsive, installable PWA-style app discovery website demo. Made by Kiran.

## Files
- `index.html` — page structure
- `style.css` — responsive dark neon design and animations
- `app.js` — demo app catalogue, search, category filters and local demo admin panel
- `manifest.json` — PWA metadata
- `sw.js` — basic offline caching

## Preview / publish
Upload all files to a GitHub repository, then enable GitHub Pages under **Settings → Pages → Deploy from a branch → main → /(root)**. Wait for the Pages URL to appear.

## Demo admin
Username: `kiran`
Password: `demo123`

**Important limitations:** This is a front-end starter/demo, not a production backend. The demo admin login is visible in client-side JavaScript and is not secure for a public site. Added/deleted app records are saved only in the current browser's local storage. It does not upload APK binaries or synchronize across devices. Before public use, add server-side authentication, database and file storage; keep credentials and secrets off the public repository. For APK hosting, check storage/bandwidth limits and only distribute files you own or are authorized to share. iPhone cannot install Android APK files; iPhone users should be sent to compatible iOS apps or official websites.
