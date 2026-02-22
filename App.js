import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

/* ============================
   LOGIN SCREEN
============================ */

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

      const pendingUsername = await AsyncStorage.getItem('pending_username');

      if (pendingUsername) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username: pendingUsername,
        });

        await AsyncStorage.removeItem('pending_username');
      }

      onLogin({
        email: data.user.email,
        username: pendingUsername || data.user.email.split('@')[0],
      });

    } catch (err) {
      Alert.alert('Login Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
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

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      await AsyncStorage.setItem('pending_username', username.trim());

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      Alert.alert(
        'Verify Email',
        'Check your email to confirm your account, then log in.'
      );

      onSwitchToLogin();

    } catch (err) {
      await AsyncStorage.removeItem('pending_username');
      Alert.alert('Signup Error', err.message);
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
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
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

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome {user.username}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            supabase.auth.signOut();
            setUser(null);
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return screen === 'login' ? (
    <LoginScreen
      onLogin={setUser}
      onSwitchToRegister={() => setScreen('register')}
    />
  ) : (
    <RegisterScreen
      onSwitchToLogin={() => setScreen('login')}
    />
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
    marginBottom: 24,
    textAlign: 'center',
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
    marginVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#0a0e27',
  },
  link: {
    color: '#d4af37',
    textAlign: 'center',
    marginTop: 12,
  },
});