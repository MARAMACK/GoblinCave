# GoblinCave Authentication System

## Overview

GoblinCave now includes a complete authentication flow with a landing page, login, and registration screens before users can access the chat application.

## User Flow

### 1. Landing Page
- **First Screen**: Beautiful landing page with app features
- **Call to Action**: "Get Started" button
- **Features Showcase**: Three key features with icons
- **Animations**: Smooth fade-in and slide-up animations

### 2. Authentication Options
- **Login**: For existing users
- **Register**: For new users
- **Easy Switching**: Toggle between login and register screens

### 3. Login Screen
- **Email Input**: With validation
- **Password Input**: Secure entry
- **Forgot Password**: Link (UI ready)
- **Error Handling**: Validates email format and required fields
- **Loading State**: Shows "Entering Cave..." while logging in

### 4. Registration Screen
- **Username Input**: Choose your goblin name
- **Email Input**: With validation
- **Password Input**: Minimum 6 characters
- **Confirm Password**: Must match password
- **Terms Agreement**: Notice about terms and privacy
- **Validation**: 
  - All fields required
  - Valid email format
  - Password length (6+ characters)
  - Passwords must match

### 5. Chat Application
- **Personalized**: Shows logged-in username
- **Logout**: Door icon (🚪) in user area
- **Confirmation**: Alert before logging out

## Features

### 🎨 Design
- **Consistent Theme**: Same goblin cave aesthetic throughout
- **Smooth Animations**: Fade-ins, slides, and transitions
- **Responsive**: Works on all screen sizes
- **Touch-Optimized**: Large tap targets, proper spacing

### 🔒 Security Features
- **Password Hiding**: Secure text entry for passwords
- **Email Validation**: Checks for valid email format
- **Password Requirements**: Minimum 6 characters
- **Confirmation**: Double-check passwords match
- **Logout Confirmation**: Prevents accidental logouts

### ✨ User Experience
- **Keyboard Handling**: Proper keyboard avoidance
- **Loading States**: Shows progress during authentication
- **Error Messages**: Clear, helpful error messages
- **Easy Navigation**: Simple switching between screens
- **Persistent State**: User stays logged in during session

## Implementation Details

### Authentication States
```javascript
const [currentScreen, setCurrentScreen] = useState('landing');
const [user, setUser] = useState(null);
```

**Screens:**
- `'landing'` - Initial landing page
- `'login'` - Login form
- `'register'` - Registration form
- `'chat'` - Main chat application (requires user)

### User Object
```javascript
{
  email: "goblin@cave.com",
  username: "GoblinKing"
}
```

### Validation Rules

**Email:**
- Required
- Must contain '@' symbol
- Format: `username@domain.com`

**Password:**
- Required
- Minimum 6 characters
- Must match confirmation (registration only)

**Username:**
- Required (registration only)
- Used as display name in chat

## Backend Integration (To Do)

Currently, the app uses simulated API calls with `setTimeout`. To connect to a real backend:

### 1. Login Function
```javascript
const handleLogin = async () => {
  try {
    const response = await fetch('YOUR_API/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Store token
      await AsyncStorage.setItem('authToken', data.token);
      onLogin({ email: data.email, username: data.username });
    } else {
      Alert.alert('Error', data.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to login');
  }
};
```

### 2. Register Function
```javascript
const handleRegister = async () => {
  try {
    const response = await fetch('YOUR_API/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      await AsyncStorage.setItem('authToken', data.token);
      onRegister({ email: data.email, username: data.username });
    } else {
      Alert.alert('Error', data.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to register');
  }
};
```

### 3. Auto-Login on App Launch
```javascript
useEffect(() => {
  checkAuthStatus();
}, []);

const checkAuthStatus = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    // Verify token with backend
    // If valid, auto-login user
    setCurrentScreen('chat');
  }
};
```

### 4. Logout Function
```javascript
const handleLogout = async () => {
  await AsyncStorage.removeItem('authToken');
  setUser(null);
  setCurrentScreen('landing');
};
```

## Required Dependencies

For persistent storage (auto-login):
```bash
npm install @react-native-async-storage/async-storage
```

For secure password storage:
```bash
npm install react-native-keychain
```

## API Endpoints Needed

Your backend should provide these endpoints:

### POST /auth/register
```json
{
  "username": "GoblinKing",
  "email": "goblin@cave.com",
  "password": "secure123"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "GoblinKing",
    "email": "goblin@cave.com"
  }
}
```

### POST /auth/login
```json
{
  "email": "goblin@cave.com",
  "password": "secure123"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "GoblinKing",
    "email": "goblin@cave.com"
  }
}
```

### POST /auth/logout
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/verify
**Headers:**
```
Authorization: Bearer jwt_token_here
```
**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "GoblinKing",
    "email": "goblin@cave.com"
  }
}
```

## Security Best Practices

### Client-Side
1. **Never store passwords** - Only store authentication tokens
2. **Use HTTPS** - All API calls over secure connection
3. **Token expiration** - Handle expired tokens gracefully
4. **Secure storage** - Use react-native-keychain for tokens
5. **Validate inputs** - Check formats before sending to server

### Server-Side (Your Backend)
1. **Hash passwords** - Use bcrypt or similar
2. **Use JWT tokens** - For stateless authentication
3. **Rate limiting** - Prevent brute force attacks
4. **Email verification** - Confirm email addresses
5. **Password reset** - Implement forgot password flow
6. **HTTPS only** - Enforce secure connections
7. **CORS** - Configure properly for mobile app

## Testing

### Test User Flows

**Happy Path - Registration:**
1. Open app → Landing page
2. Tap "Get Started"
3. Tap "Register"
4. Enter username: "TestGoblin"
5. Enter email: "test@cave.com"
6. Enter password: "test123"
7. Confirm password: "test123"
8. Tap "Create Account"
9. Should see chat screen with "TestGoblin" as username

**Happy Path - Login:**
1. Open app → Landing page
2. Tap "Get Started"
3. Enter email: "test@cave.com"
4. Enter password: "test123"
5. Tap "Login"
6. Should see chat screen

**Error Handling:**
- Empty fields → Show error
- Invalid email → Show error
- Short password → Show error
- Mismatched passwords → Show error

## Future Enhancements

- [ ] Email verification
- [ ] Password reset flow
- [ ] Social login (Google, Apple)
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Two-factor authentication (2FA)
- [ ] Profile pictures
- [ ] Account settings
- [ ] Delete account
- [ ] Session management
- [ ] Remember me option

## Screenshots Needed

For app store submission, capture:
1. Landing page
2. Login screen
3. Registration screen
4. Chat screen (logged in)

---

**Your GoblinCave authentication is ready!** 🏰🔐
