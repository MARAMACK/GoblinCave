# GoblinCave - Mobile App

A fully functional goblin-themed chat application for iOS and Android built with React Native.

## 🎮 Features

- ✅ **Full chat functionality**
  - Server switching
  - Text and voice channels
  - Real-time messaging
  - Online user list
  - User status indicators

- ⚔️ **Goblin Theme**
  - Medieval fantasy aesthetic
  - Dark cave-like colors with gold accents
  - Goblin-themed channel names
  - Fantasy emojis throughout

- 📱 **Native Mobile Support**
  - Optimized for iOS and Android
  - Touch-friendly interface
  - Keyboard handling
  - Smooth animations
  - Responsive panels

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **For iOS (Mac only):**
   ```bash
   cd ios
   pod install
   cd ..
   npm run ios
   ```

3. **For Android:**
   ```bash
   npm run android
   ```

## 📦 Project Structure

```
goblincave/
├── App.js              # Main application component
├── index.js            # Entry point
├── app.json            # App configuration
├── package.json        # Dependencies
└── README.md          # This file
```

## 🛠️ Building for Production

### iOS

1. Open `ios/GoblinCave.xcworkspace` in Xcode
2. Select your development team
3. Choose "Any iOS Device" as destination
4. Product → Archive
5. Follow App Store submission process

### Android

1. Generate a signing key:
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore goblincave.keystore -alias goblincave -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Build the APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## 📱 Features Breakdown

### Server Management
- Switch between multiple goblin-themed servers
- Visual active server indicator
- Add new servers (UI ready)

### Channel System
- Text channels for different topics
- Voice channels (UI ready for integration)
- Active channel highlighting
- Smooth channel switching

### Messaging
- Send and receive messages
- Message timestamps
- User avatars with colors
- Auto-scroll to newest messages
- Keyboard-aware input

### User Interface
- Collapsible sidebar
- Toggleable user panel
- Touch-optimized controls
- Native mobile animations
- Responsive design

### Theming
- Dark goblin cave aesthetic
- Gold accent colors
- Medieval fonts (where supported)
- Custom status indicators

## 🎨 Customization

### Colors
The main theme colors are defined in the StyleSheet:
- Primary: `#d4af37` (Gold)
- Background: `#0a0e27` (Dark Blue)
- Secondary: `#8b4513` (Brown)
- Accent: `#4169e1` (Royal Blue)

### Adding Servers
Edit the `servers` state in `App.js`:
```javascript
const [servers] = useState([
  { id: 5, name: 'Your Server', icon: '🏰', color: '#yourcolor' },
  // ... more servers
]);
```

### Adding Channels
Edit the `channels` state in `App.js`:
```javascript
const [channels] = useState([
  { id: 7, name: 'your-channel', type: 'text', icon: '#' },
  // ... more channels
]);
```

## 🔧 Troubleshooting

### iOS Issues
- If pods fail to install: `cd ios && pod install --repo-update`
- Clear cache: `rm -rf ~/Library/Developer/Xcode/DerivedData`

### Android Issues
- Clean build: `cd android && ./gradlew clean`
- Clear cache: `watchman watch-del-all && rm -rf node_modules && npm install`

### General Issues
- Reset Metro bundler: `npm start -- --reset-cache`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

This project is open source and available for personal and commercial use.

## 🎯 Future Enhancements

- [ ] Voice chat integration
- [ ] Push notifications
- [ ] Direct messaging
- [ ] File/image sharing
- [ ] Message reactions
- [ ] User profiles
- [ ] Server creation
- [ ] Role management
- [ ] Search functionality
- [ ] Dark/Light theme toggle

## 🤝 Contributing

Feel free to fork this project and customize it for your own goblin hoard!

## 📞 Support

For issues or questions, please check the troubleshooting section above.

---

**Made with ⚔️ by the Goblin Developers Guild**
