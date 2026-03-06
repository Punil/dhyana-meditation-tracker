# How to Build the Android APK

This project is set up with **Capacitor**, which allows you to turn this web application into a native Android app.

## Prerequisites

To build the APK, you need to have the following installed on your computer:

1.  **Node.js** (v18 or higher)
2.  **Android Studio** (Download from [developer.android.com](https://developer.android.com/studio))
3.  **Java Development Kit (JDK)** (Usually included with Android Studio)

## Steps to Generate APK

1.  **Install Dependencies**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

2.  **Build the Web App & Sync with Android**
    Run the following command to build the React app and copy the files to the Android project:
    ```bash
    npm run cap:sync
    ```

3.  **Open in Android Studio**
    Run this command to open the project in Android Studio:
    ```bash
    npm run cap:open
    ```

4.  **Build the APK**
    Once Android Studio opens:
    - Wait for Gradle sync to finish (bottom right progress bar).
    - **Set App Icon**: 
        1. Right-click the `app` folder -> **New > Image Asset**.
        2. In "Path", select your lotus icon image (ensure it has droplets as desired).
        3. Adjust scaling and background color (e.g., white) to fit the circle.
        4. Click **Next** and **Finish**.
    - Go to the menu bar: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    - Once the build is complete, a notification will appear. Click **locate** to find your `.apk` file.
    - You can now transfer this file to your Android phone and install it!

## Alternative: Install as PWA (No APK needed)

You don't strictly need an APK to use this app on Android.
1.  Open the app in Chrome on your Android phone.
2.  Tap the menu (three dots) -> **Add to Home Screen** or **Install App**.
3.  It will appear on your home screen and work just like a native app (offline support, full screen, etc.).
