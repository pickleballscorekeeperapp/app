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

## Remaining Console Setup

1. Create the Apple App Store Connect app record for the Pickleball bundle ID.
2. Add the resulting Pickleball `ascAppId` to `eas.json` under `submit.production.ios`.
3. Create the Google Play Console app record for the Pickleball package name.
4. Upload the Android build to the `internal` track.
5. Add internal testers in App Store Connect/TestFlight and Google Play Console.
