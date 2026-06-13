# Pickleball Score Keeper Store Submission Notes

## Separation From CourtsideView

- Expo/EAS project: `@abridegan/pickleball-score-keeper`
- EAS project ID: `6f29222e-67f0-411b-851b-32e23775487e`
- iOS bundle ID: `com.houseofturnberry.pickleballscorekeeper`
- Android package: `com.houseofturnberry.pickleballscorekeeper`
- Git repo: standalone local repo at this project root
- Shared account-level credentials may be reused, but app-specific IDs must not be copied from CourtsideView.

## Store Metadata

- App name: `Pickleball Score Keeper`
- Subtitle: `Official side-out scoring`
- Category: Sports
- Privacy: Data Not Collected
- Tracking: No
- Network calls: None in v1
- Accounts/login: None in v1
- Runtime permissions: None requested intentionally

## Internal Testing Targets

- Apple: App Store Connect app record plus TestFlight internal testers.
- Android: Google Play Console app record plus internal testing track.

## EAS Build Artifacts

- Production iOS builds create App Store/TestFlight `.ipa` files.
- Production Android builds create Play Store `.aab` files.
- EAS remote versioning is enabled, so `ios.buildNumber` and `android.versionCode` are managed by EAS.

### Current Internal-Test Builds

- Android AAB
  - EAS build ID: `a5254fe0-6b17-4aad-b216-bf77949587c9`
  - Version: `1.0.0`
  - Version code: `2`
  - Local artifact: `builds/pickleball-score-keeper-android-1.0.0-2.aab`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/a5254fe0-6b17-4aad-b216-bf77949587c9`
- iOS IPA
  - EAS build ID: `19678d11-0d4e-472b-8629-ab005cbc9af0`
  - Version: `1.0.0`
  - Build number: `3`
  - Local artifact: `builds/pickleball-score-keeper-ios-1.0.0-3.ipa`
  - EAS build page: `https://expo.dev/accounts/abridegan/projects/pickleball-score-keeper/builds/19678d11-0d4e-472b-8629-ab005cbc9af0`

### Submission Status

- Android: EAS automated submit was attempted for the `internal` track and failed because Google requires the first submission of a new app to be performed manually in Play Console.
- iOS: EAS automated submit is ready once the Pickleball App Store Connect app exists and its `ascAppId` is added to `eas.json`.

## Remaining Console Setup

1. Create the Apple App Store Connect app record for the Pickleball bundle ID.
2. Add the resulting Pickleball `ascAppId` to `eas.json` under `submit.production.ios`.
3. Create the Google Play Console app record for the Pickleball package name.
4. Upload the Android build to the `internal` track.
5. Add internal testers in App Store Connect/TestFlight and Google Play Console.
