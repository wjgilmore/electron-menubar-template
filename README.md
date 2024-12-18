# Timezone Clock Menubar App

## Installation

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start`

## Settings

The settings are stored in the `settings.json` file.

## Cities

The cities are stored in the `cities.json` file. You can add or remove cities from this file to customize the app.

## The App Icon

The app icon is stored in the `icon.icns` file. It was generated using the `png-to-icns` script:

```
$ mkdir icon.iconset
$ chmod +x png-to-icns.sh
$ ./png-to-icns.sh icon.png
```

This will generate the `icon.icns` file. See the `forge.config.js` file for more information.

## Signing the App

Run this command to confirm code signing certificates are available:

```
$ security find-identity -p codesigning -v
```

Presuming you see the correct certificates, build the app with:

```
$ npm run make
```

You can confirm an installed app was correctly signed with:

```
$ codesign -dvvv timezones.app
```
