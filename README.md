# Futupolis App 🤖

Application for Futucamp 2018 - Futupolis

### Architecture

* React Native (0.55) + Redux
* iOS and Android support
* Selectors with [reselect](https://github.com/reactjs/reselect/) to access
  store
* Redux architecture using
  [ducks](https://github.com/erikras/ducks-modular-redux). See `/app/concepts`
* Data processing in _concepts_ and minimize logic in views

## Local development

**BEFORE JUMPING TO IOS OR ANDROID GUIDE:**

* `npm install`
* `cp env.example.js env.js` and fill in the blank secrets in the file
* `react-native link`

### iOS

The xcode-project is expecting that you have nvm installed. It can be
reconfigured in `Build Phases > Bundle React Native code and images`.

* [Install Cocoapods](https://guides.cocoapods.org/using/getting-started.html#installation)
* `cd ios && pod update && pod install`
* Run app with `cd .. && react-native run-ios`
* Or with xcode `open prahappclient.xcworkspace`

  **Note:** Use the .xworkspace instead of .xcodeproj!

### Android

* [Setup Android Environment](http://facebook.github.io/react-native/releases/0.44/docs/getting-started.html#android-development-environment)
* Start emulator or connect your Android device with USB cable
* `react-native run-android`

## Release

### iOS

* Make sure you have latest App Store provisioning profile installed
* Package production script bundle with `npm run release:ios`
* In XCode project settings, bump Version field
* Choose `Generic iOS Device` (or a connected iPhone) as build target
* Run `Product > Clean` (for paranoia) and `Product > Archive`
* Go to `Window > Organizer`, select latest build with correct version and press
  Upload to App Store

### Android

* Copy `whappu-release.keystore` under `android/app` if it's not there already.
* Bump `versionCode` and `versionName` in `android/app/build.gradle`
* `cd android && ./gradlew assembleRelease --no-daemon`
* Built .apk is saved to `android/app/build/outputs/apk`

## Other Repositories

* Backend repository here: https://github.com/palampinen/futupolis-backend

* Originally based on https://github.com/futurice/prahapp-client

## License
MIT
