# Inventory POS (Expo Router + Firebase)

This project is an Inventory POS starter built with:

- **Expo + Expo Router + TypeScript**
- **Firebase Firestore**
- **VS Code**

## What you should see when it runs

You should **not** see Expo's default "Try it / Explore / Get a fresh start" template anymore.

You should see two tabs:

- **Home**: Inventory management screen (add/edit/delete products)
- **Explore**: simple setup/status screen

If you still see the default welcome template, make sure you are starting this project folder and clear cache:

```bash
npm run start -- --clear
```

## 1) Prerequisites

- Node.js LTS
- npm
- Expo Go app or simulator
- Firebase account + project

## 2) Setup project

Install dependencies:

```bash
npm install
```

Then open `src/firebaseConfig.ts` and replace all `REPLACE_ME` values with your Firebase web app config.

Enable Firestore in Firebase Console. The app uses an `inventory` collection.

## 3) Run locally

```bash
npm run start
```

Use the QR code in Expo Go.

## Helpful path commands by terminal type

- Windows **cmd**: `cd` (shows current path)
- PowerShell: `pwd`
- Git Bash / macOS / Linux: `pwd`

## Next milestones (optional)

- Authentication (owner/staff)
- Sales checkout + receipts
- Reports dashboard
