# Mobile App Store Deployment Guide (Android & iOS)

This guide documents the native integration layer added for **Google Play Store** (Android) and **Apple App Store** (iOS) packaging, along with instructions for building and 100% reversible rollback if ever needed.

---

## 1. Native Architecture Overview

The native mobile layer uses **Capacitor**, the industry-standard native bridge. It leaves 100% of the web React/Vite architecture intact while wrapping the production web build (`dist/`) into native Android and iOS container projects.

### Key Components Added:
1. **`capacitor.config.ts`**: App configuration (App ID: `net.zetacalculator.app`, App Name: `Zeta Calculator`, web asset directory `dist`).
2. **`android/`**: Native Android Studio / Gradle project ready for Google Play Store generation.
3. **`ios/`**: Native Xcode project ready for Apple App Store generation.
4. **`/src/mobile/capacitorBridge.ts`**:
   - Status bar styling (adapts to light/dark themes).
   - Splash screen smooth auto-hide.
   - **Android Hardware Back Button Handling**: Automatically intercepts physical/gesture back button presses on Android devices to close open search modals or navigate back within calculator history before exiting the app.
   - **Zero Web Side-Effects**: When run in a web browser or desktop, `Capacitor.isNativePlatform()` returns `false`, causing all native bridges to immediately and silently no-op.
5. **Mobile Viewport & Safe Area Support**:
   - `index.html`: `viewport-fit=cover` and Apple mobile web app tags.
   - `src/index.css`: Safe area CSS variables (`env(safe-area-inset-top)`, etc.) preventing notch/dynamic island clipping on modern iPhones and edge-to-edge Android devices.
6. **`public/site.webmanifest`**: Complete PWA / TWA compliance (standard icons, short name, portrait orientation, standalone display mode).

---

## 2. How to Build for Google Play Store (Android)

### Prerequisites:
- Android Studio installed on your computer.
- Java Development Kit (JDK 17 or 21).

### Build Steps:
1. **Build and sync web assets to Android**:
   ```bash
   npm run cap:build
   npm run cap:sync
   ```
2. **Open the Android project in Android Studio**:
   ```bash
   npm run cap:android
   ```
   *(Or open the `/android` directory directly in Android Studio).*
3. **In Android Studio**:
   - Go to **Build** > **Generate Signed Bundle / APK**.
   - Choose **Android App Bundle (.aab)** for Google Play Console submission.
   - Select or create your keystore file, sign, and build.
   - Upload the resulting `.aab` to the [Google Play Console](https://play.google.com/console).

---

## 3. How to Build for Apple App Store (iOS)

### Prerequisites:
- macOS computer with Xcode installed.
- Apple Developer Account.

### Build Steps:
1. **Build and sync web assets to iOS**:
   ```bash
   npm run cap:build
   npm run cap:sync
   ```
2. **Open the iOS project in Xcode**:
   ```bash
   npm run cap:ios
   ```
   *(Or open the `/ios/App/App.xcworkspace` in Xcode).*
3. **In Xcode**:
   - Select the `App` target.
   - Under **Signing & Capabilities**, select your Apple Developer Team.
   - Choose **Product** > **Archive**.
   - In the Organizer window, click **Distribute App** to upload to [App Store Connect](https://appstoreconnect.apple.com) / TestFlight.

---

## 4. How to Revert (Rollback Guarantee)

If you ever wish to completely remove the mobile layer and return strictly to a pure browser-only codebase, follow these 4 simple steps:

1. **Delete native project folders & configs**:
   ```bash
   rm -rf android ios capacitor.config.ts src/mobile
   ```
2. **Uninstall mobile dependencies**:
   ```bash
   npm uninstall @capacitor/core @capacitor/app @capacitor/status-bar @capacitor/splash-screen @capacitor/cli @capacitor/android @capacitor/ios
   ```
3. **Remove Capacitor hook from `src/App.tsx`**:
   - Remove `import { initCapacitorMobile } from './mobile/capacitorBridge';`
   - Remove the `useEffect` block that calls `initCapacitorMobile(...)`.
4. **Clean and rebuild**:
   ```bash
   npm run build
   ```
