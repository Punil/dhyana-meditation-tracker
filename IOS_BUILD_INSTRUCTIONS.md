# How to Build the iOS App

This project uses **Capacitor** to build a native iOS application.

## Prerequisites (macOS Required)

To build iOS apps, you **must** have a Mac computer with the following installed:

1.  **Xcode** (Download from the Mac App Store)
2.  **CocoaPods** (Run `sudo gem install cocoapods` in terminal if not installed)
3.  **Node.js** (v18 or higher)

> **Note:** iOS apps cannot be built directly on Windows or Linux because Xcode is required. See the "Windows Users" section below for alternatives.

## Steps to Generate the iOS App (Mac Only)

1.  **Install Dependencies**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

2.  **Build the Web App & Sync with iOS**
    Run this command to build the React app and copy the files to the iOS project:
    ```bash
    npm run cap:ios:sync
    ```

3.  **Open in Xcode**
    Run this command to open the project in Xcode:
    ```bash
    npm run cap:ios:open
    ```

4.  **Configure Signing & Capabilities**
    - In Xcode, click on the **App** project in the left sidebar.
    - Select the **Signing & Capabilities** tab.
    - Select your **Team** (you need an Apple ID).
    - Ensure the **Bundle Identifier** is unique (e.g., `com.dhyana.meditation`).

5.  **Run on Simulator or Device**
    - Select a simulator (e.g., iPhone 15) or your connected iPhone from the top bar.
    - Click the **Play** button (Run).

## App Icon

To set the app icon for iOS:
1.  Open the project in Xcode (`npm run cap:ios:open`).
2.  In the project navigator (left sidebar), go to `App` > `App` > `Assets`.
3.  Select `AppIcon`.
4.  Drag and drop your icon images into the appropriate slots (1x, 2x, 3x sizes).
    - You can use a tool like [App Icon Generator](https://www.appicon.co/) to generate all required sizes from your source image.

## Deploying to App Store

To publish to the App Store, you will need:
1.  An enrolled **Apple Developer Program** account ($99/year).
2.  In Xcode, go to **Product > Archive**.
3.  Follow the prompts to validate and upload your app to App Store Connect.

## Windows / Linux Users

Since **Xcode** is only available on macOS, you cannot build the iOS app directly on a Windows PC. However, you have a few options:

### Option 1: Cloud Build Services (Recommended)
You can use a cloud CI/CD service to build the iOS binary for you.
-   **Ionic Appflow**: The official cloud build service for Capacitor. It can build your iOS app in the cloud and even deploy it to the App Store.
-   **GitHub Actions**: You can configure a GitHub Action with a `macos-latest` runner to build your app.

### Option 2: Rent a Mac in the Cloud
Services like **MacinCloud** or **MacStadium** allow you to remotely access a Mac. You can install this project there and run the build commands as if you were on a local Mac.

### Option 3: Borrow a Mac
You can develop the entire app on Windows (using the web preview or Android build to test). When you are ready to release, you only need a Mac for the final build and upload step. You can clone your project on a friend's Mac or a work machine to perform the final `npm run cap:ios:sync` and archive process.
