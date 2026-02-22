import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

/**
 * IMPORTANT:
 * Set this to your GitHub Pages callback URL EXACTLY.
 * Example you described:
 * https://mermac.github.io/goblincave/#/auth/callback
 */
const EMAIL_REDIRECT_TO =
  'https://mermac.github.io/goblincave/#/auth/callback';

/**
 * Helper: for GitHub Pages / SPA callback detection (web only)
 */
function isOnAuthCallbackRoute() {
  if (Platform.OS !== 'web') return false;
  const hash = window.location.hash || '';
  // Matches "#/auth/callback" and also "#/auth/callback?..."
  return hash.startsWith('#/auth/callback');
}

/* ============================
   AUTH CALLBACK SCREEN (WEB)
============================ */

const AuthCallbackScreen = ({ onDone }) => {
  useEffect(() => {
    const finalize = async () => {
      try {
        // Supabase parses the tokens/code from the URL and stores the session (web)
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) throw error;

        const session = data?.session;
        const user = session?.user;

        if (!user) {
          Alert.alert(
            'Auth callback failed',
            'No session found in the callback URL. Make sure your Supabase Redirect URLs include your GitHub Pages callback URL.'
          );
          onDone(null);
          return;
        }

        // If you require verified email, enforce it here.
        // Depending on your Supabase configuration, this should be set after clicking the email link.
        if (!user.email_confirmed_at) {
          await supabase.auth.signOut();
          Alert.alert(
            'Email not verified',
            'Your email is not verified yet. Please try again after confirming your email.'
          );
          onDone(null);
          return;
        }

        // Create profile once, using pending_username saved during signup
        const pendingUsername = await AsyncStorage.getItem('pending_username');
        if (pendingUsername) {
          // Upsert is safer than insert (in case callback runs twice)
          const { error: profileErr } = await supabase
            .from('profiles')
            .upsert(
              { id: user.id, username: pendingUsername },
              { onConflict: 'id' }
            );

          if (profileErr) {
            // If username is unique and already taken, you'll see it here
            throw profileErr;
          }

          await AsyncStorage.removeItem('pending_username');
        }

        // Clean up URL hash so refresh doesn't re-run callback
        if (Platform.OS === 'web') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        onDone({
          email: user.email,
          username: pendingUsername || user.email.split('@')[0],
        });
      } catch (err) {
        Alert.alert('Callback Error', err?.message ?? 'Unknown error');
        onDone(null);
      }
    };

    finalize();
  }, [onDone]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Finishing sign-in…</Text>
      <ActivityIndicator color="#d4af37" />
      <Text style={styles.subtitle}>
        If this screen never completes, confirm your Redirect URLs in Supabase.
      </Text>
    </SafeAreaView>
  );
};

/* ============================
   LOGIN SCREEN
============================ */

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      const user = data?.user;
      if (!user) {
        throw new Error('No user returned from sign-in.');
      }

      // Enforce verified email
      if (!user.email_confirmed_at) {
        await supabase.auth.signOut();
        Alert.alert(
          'Email not verified',
          'Please verify your email using the link we sent you, then try logging in again.\n\nYou can also tap "Resend verification email".'
        );
        return;
      }

      // If user had a pending username (from a previous signup attempt), create profile now
      const pendingUsername = await AsyncStorage.getItem('pending_username');
      if (pendingUsername) {
        const { error: profileErr } = await supabase
          .from('profiles')
          .upsert(
            { id: user.id, username: pendingUsername },
            { onConflict: 'id' }
          );

        if (profileErr) throw profileErr;
        await AsyncStorage.removeItem('pending_username');
      }

      onLogin({
        email: user.email,
        username: pendingUsername || user.email.split('@')[0],
      });
    } catch (err) {
      Alert.alert('Login Error', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Enter your email above first.');
      return;
    }

    try {
      setResending(true);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: EMAIL_REDIRECT_TO },
      });

      if (error) throw error;

      Alert.alert(
        'Verification sent',
        'If the email exists and is unverified, a new verification email was sent.'
      );
    } catch (err) {
      Alert.alert('Resend Error', err?.message ?? 'Unknown error');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#b9b9b9"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b9b9b9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, resending && styles.buttonDisabled]}
        onPress={handleResendVerification}
        disabled={resending}
      >
        <Text style={styles.secondaryButtonText}>
          {resending ? 'Resending…' : 'Resend verification email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToRegister}>
        <Text style={styles.link}>Create an account</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

/* ============================
   REGISTER SCREEN
============================ */

const RegisterScreen = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // Save username locally so it is NOT reserved server-side until verified
      await AsyncStorage.setItem('pending_username', username.trim());

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: EMAIL_REDIRECT_TO,
        },
      });

      if (error) throw error;

      Alert.alert(
        'Verify Email',
        'Check your email for a verification link. After clicking it, you will be redirected back here to finish setup.'
      );

      onSwitchToLogin();
    } catch (err) {
      await AsyncStorage.removeItem('pending_username');
      Alert.alert('Signup Error', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#b9b9b9"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#b9b9b9"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b9b9b9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#b9b9b9"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToLogin}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

/* ============================
   MAIN APP
============================ */

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);

  // If user lands on the GitHub Pages auth callback URL, finalize session.
  useEffect(() => {
    if (isOnAuthCallbackRoute()) {
      setScreen('authCallback');
    }
  }, []);

  if (screen === 'authCallback') {
    return (
      <AuthCallbackScreen
        onDone={(userData) => {
          if (userData) {
            setUser(userData);
          } else {
            setUser(null);
            setScreen('login');
          }
        }}
      />
    );
  }

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome {user.username}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await supabase.auth.signOut();
            setUser(null);
            setScreen('login');
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return screen === 'login' ? (
    <LoginScreen
      onLogin={(u) => {
        setUser(u);
        setScreen('login');
      }}
      onSwitchToRegister={() => setScreen('register')}
    />
  ) : (
    <RegisterScreen onSwitchToLogin={() => setScreen('login')} />
  );
}

/* ============================
   STYLES
============================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: '#d4af37',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 13,
    color: '#b9b9b9',
    textAlign: 'center',
    opacity: 0.9,
  },
  input: {
    backgroundColor: '#1a1f3a',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    color: 'white',
  },
  button: {
    backgroundColor: '#d4af37',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  secondaryButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  secondaryButtonText: {
    fontWeight: '600',
    color: '#d4af37',
  },
  link: {
    color: '#d4af37',
    textAlign: 'center',
    marginTop: 14,
  },
});
