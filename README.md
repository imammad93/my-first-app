# Öyrən və Oyna 🎈

An Android learning game for kids aged 4–10, built with Expo (React Native).
Three mini-games teach math, English vocabulary, and the alphabet through
simple multiple-choice play with big colorful buttons and celebration
animations.

## Games

- **Riyaziyyat (Math)** — addition/subtraction (1–10) with picture hints.
- **İngilis dili (English)** — match an emoji to its English word.
- **Əlifba (Alphabet)** — pick the picture that starts with the shown letter.

## Run it on your Android phone

1. Install the **Expo Go** app from the Google Play Store.
2. On your computer, inside this project folder, run:
   ```bash
   npm install
   npm start
   ```
3. Scan the QR code shown in the terminal with the Expo Go app (or the
   phone's camera) — the app opens instantly, no build step needed.

## Build a real APK (optional)

Once you're happy with the app, you can produce an installable APK with
[EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npm install -g eas-cli
eas build -p android --profile preview
```

## Project structure

```
App.tsx                  navigation setup
src/screens/              Home + the three game screens
src/components/           shared UI (option buttons, score badge, celebration)
src/data/                 question generators for each game
```
