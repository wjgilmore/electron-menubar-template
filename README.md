# Electron Menubar App Template

## Installation

1. Clone the repository into a folder
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start`

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
