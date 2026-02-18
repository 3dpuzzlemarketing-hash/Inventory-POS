# Inventory POS (Expo + Firebase)

This repository is a starter Inventory POS app built with:

- **Expo (React Native + TypeScript)**
- **Firebase Firestore**
- **VS Code** as the recommended editor

It includes a basic inventory flow:

- Add product items (name, SKU, quantity, price)
- View inventory list
- Edit and delete items
- See total stock value

## 1) Prerequisites

Install the following on your machine:

- Node.js LTS
- npm
- Expo Go app (on your phone) or Android/iOS simulator
- VS Code
- Firebase account + project

## 2) Setup project

```bash
npm install
```

Update Firebase credentials:

1. Open `src/firebaseConfig.ts`
2. Replace all `REPLACE_ME` values with your Firebase web app config

Enable Firestore in Firebase Console and create the `inventory` collection (or let the app create it when you add the first item).

## 3) Run locally

```bash
npm run start
```

Then open:

- Android emulator (`a` in terminal)
- iOS simulator (`i` in terminal on macOS)
- Expo Go by scanning QR code

## 4) Recommended Firestore rules for development

Use permissive rules for early local testing only:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Before publishing, tighten rules with authentication + role checks.

## 5) Publish goal (EAS Build + EAS Submit)

Install EAS CLI globally:

```bash
npm install -g eas-cli
```

Login and configure:

```bash
eas login
eas build:configure
```

Create preview or production builds:

```bash
eas build --platform android
eas build --platform ios
```

For app store submission:

```bash
eas submit --platform android
eas submit --platform ios
```

## 6) Suggested next milestones

- Add Firebase Authentication (owner/staff roles)
- Add barcode scanning (Expo Camera)
- Add sales/cart flow and receipt generation
- Add offline sync strategy
- Add analytics and crash reporting

---

If you want, next I can help you add:

1. **Authentication + protected inventory**
2. **Sales checkout module**
3. **Daily sales reports dashboard**
