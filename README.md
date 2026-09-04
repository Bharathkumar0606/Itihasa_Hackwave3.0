# Itihasa_Hackwave3.0

**What if the monuments we walk past every day could tell us their stories?**

Itihasa helps children and adults discover the people, struggles, achievements, and forgotten stories behind India's forts, temples, sculptures, and historic sites. It teaches history through memorable storytelling, emotion, context, and curiosity.

Itihasa - Discover the forgotten, remember the story.

## Firebase login setup

## Firebase login setup

The Google login uses Firebase Authentication for project `itihasa-3c43c`.

1. Open Firebase Console and select `itihasa-3c43c`.
2. Go to **Authentication > Get started** if Authentication is not enabled.
3. Open **Sign-in providers**, enable **Google**, and save.
4. Open **Authentication > Settings > Authorized domains** and add `localhost`.
5. Restart the Vite server and try the profile button again.

`auth/configuration-not-found` means step 2 or the Identity Toolkit API is still disabled for the Firebase project. Enable the Identity Toolkit API in Google Cloud APIs, wait briefly, and retry.

The app also uses OpenStreetMap tiles through Leaflet, so Google Maps billing is not required.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
