import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Alert,
  Modal,
  Switch,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// User Status Options
const USER_STATUSES = {
  ONLINE: { label: 'Online', color: '#4ade80', icon: '🟢' },
  AWAY: { label: 'Away', color: '#fbbf24', icon: '🟡' },
  DO_NOT_DISTURB: { label: 'Do Not Disturb', color: '#ef4444', icon: '🔴' },
  OFFLINE: { label: 'Offline', color: '#6b7280', icon: '⚫' },
};

// Landing Page Component
const LandingPage = ({ onGetStarted }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.landingContainer}>
      <View style={styles.landingContent}>
        <Animated.View 
          style={[
            styles.landingHeader,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.landingIcon}>🏰</Text>
          <Text style={styles.landingTitle}>GoblinCave</Text>
          <Text style={styles.landingSubtitle}>
            Join the goblin hoard and connect with fellow treasure hunters
          </Text>
        </Animated.View>

        <Animated.View style={[styles.landingFeatures, { opacity: fadeAnim }]}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚔️</Text>
            <Text style={styles.featureTitle}>Epic Raids</Text>
            <Text style={styles.featureText}>
              Coordinate raids and share treasures with your goblin clan
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureTitle}>Hoard Together</Text>
            <Text style={styles.featureText}>
              Create servers and channels for your goblin gatherings
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🗡️</Text>
            <Text style={styles.featureTitle}>Real-time Chat</Text>
            <Text style={styles.featureText}>
              Communicate instantly with your fellow goblins
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.landingActions, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={onGetStarted}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <Text style={styles.landingFooter}>
            Free to join • No credit card required
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

// Login Component
const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, username: email.split('@')[0] });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.authContent}
      >
        <ScrollView 
          contentContainerStyle={styles.authScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authHeader}>
            <Text style={styles.authIcon}>🏰</Text>
            <Text style={styles.authTitle}>Welcome Back</Text>
            <Text style={styles.authSubtitle}>Enter the goblin cave</Text>
          </View>

          <View style={styles.authForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>📧</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="goblin@cave.com"
                  placeholderTextColor="#8b7355"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>🔒</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#8b7355"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Entering Cave...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.authSwitch}>
              <Text style={styles.authSwitchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={styles.authSwitchLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Register Component
const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
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

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      onRegister({ email, username });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.authContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.authContent}
      >
        <ScrollView 
          contentContainerStyle={styles.authScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authHeader}>
            <Text style={styles.authIcon}>🏰</Text>
            <Text style={styles.authTitle}>Join the Hoard</Text>
            <Text style={styles.authSubtitle}>Create your goblin account</Text>
          </View>

          <View style={styles.authForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>👹</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="GoblinWarrior"
                  placeholderTextColor="#8b7355"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>📧</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="goblin@cave.com"
                  placeholderTextColor="#8b7355"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>🔒</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="At least 6 characters"
                  placeholderTextColor="#8b7355"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIconText}>🔒</Text>
                <TextInput
                  style={styles.authInput}
                  placeholder="Re-enter password"
                  placeholderTextColor="#8b7355"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.authSwitch}>
              <Text style={styles.authSwitchText}>Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={styles.authSwitchLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By registering, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Server Setup Modal
const ServerSetupModal = ({ visible, onClose, onCreateServer, onJoinServer }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [serverName, setServerName] = useState('');
  const [serverIcon, setServerIcon] = useState('💰');
  const [inviteCode, setInviteCode] = useState('');

  const icons = ['💰', '🦇', '🍄', '💎', '⚔️', '🗡️', '🏰', '👑', '🔥', '⭐'];

  const handleCreate = () => {
    if (!serverName.trim()) {
      Alert.alert('Error', 'Please enter a server name');
      return;
    }
    onCreateServer({ name: serverName, icon: serverIcon });
    setServerName('');
    onClose();
  };

  const handleJoin = () => {
    if (!inviteCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }
    onJoinServer(inviteCode);
    setInviteCode('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Get Started</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'create' && styles.tabActive]}
              onPress={() => setActiveTab('create')}
            >
              <Text style={[styles.tabText, activeTab === 'create' && styles.tabTextActive]}>
                Create Server
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'join' && styles.tabActive]}
              onPress={() => setActiveTab('join')}
            >
              <Text style={[styles.tabText, activeTab === 'join' && styles.tabTextActive]}>
                Join Server
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'create' ? (
            <View style={styles.tabContent}>
              <Text style={styles.modalLabel}>Server Icon</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.iconScroll}
              >
                {icons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      serverIcon === icon && styles.iconOptionActive
                    ]}
                    onPress={() => setServerIcon(icon)}
                  >
                    <Text style={styles.iconOptionText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.modalLabel}>Server Name</Text>
              <View style={styles.modalInputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="My Goblin Hoard"
                  placeholderTextColor="#8b7355"
                  value={serverName}
                  onChangeText={setServerName}
                  maxLength={50}
                />
              </View>

              <TouchableOpacity style={styles.modalButton} onPress={handleCreate}>
                <Text style={styles.modalButtonText}>Create Server</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.modalDescription}>
                Enter an invite code to join an existing server
              </Text>

              <Text style={styles.modalLabel}>Invite Code</Text>
              <View style={styles.modalInputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="ABC123XYZ"
                  placeholderTextColor="#8b7355"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  autoCapitalize="characters"
                  maxLength={20}
                />
              </View>

              <TouchableOpacity style={styles.modalButton} onPress={handleJoin}>
                <Text style={styles.modalButtonText}>Join Server</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// Settings Modal
const SettingsModal = ({ visible, onClose, user, userStatus, onStatusChange, settings, onSettingsChange }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.settingsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.settingsContent}>
            {/* User Profile Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Profile</Text>
              
              <View style={styles.profileCard}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>🎭</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user.username}</Text>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </View>
              </View>
            </View>

            {/* Status Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Status</Text>
              
              {Object.entries(USER_STATUSES).map(([key, status]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.statusOption,
                    userStatus === key && styles.statusOptionActive
                  ]}
                  onPress={() => onStatusChange(key)}
                >
                  <Text style={styles.statusIcon}>{status.icon}</Text>
                  <Text style={[
                    styles.statusLabel,
                    userStatus === key && styles.statusLabelActive
                  ]}>
                    {status.label}
                  </Text>
                  {userStatus === key && (
                    <Text style={styles.statusCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Notifications Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive notifications for new messages
                  </Text>
                </View>
                <Switch
                  value={settings.pushNotifications}
                  onValueChange={(value) => 
                    onSettingsChange({ ...settings, pushNotifications: value })
                  }
                  trackColor={{ false: '#4b5563', true: '#d4af37' }}
                  thumbColor={settings.pushNotifications ? '#fff' : '#d1d5db'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Message Sounds</Text>
                  <Text style={styles.settingDescription}>
                    Play sound for new messages
                  </Text>
                </View>
                <Switch
                  value={settings.messageSounds}
                  onValueChange={(value) => 
                    onSettingsChange({ ...settings, messageSounds: value })
                  }
                  trackColor={{ false: '#4b5563', true: '#d4af37' }}
                  thumbColor={settings.messageSounds ? '#fff' : '#d1d5db'}
                />
              </View>
            </View>

            {/* Privacy Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Privacy</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Show Online Status</Text>
                  <Text style={styles.settingDescription}>
                    Let others see when you're online
                  </Text>
                </View>
                <Switch
                  value={settings.showOnlineStatus}
                  onValueChange={(value) => 
                    onSettingsChange({ ...settings, showOnlineStatus: value })
                  }
                  trackColor={{ false: '#4b5563', true: '#d4af37' }}
                  thumbColor={settings.showOnlineStatus ? '#fff' : '#d1d5db'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Read Receipts</Text>
                  <Text style={styles.settingDescription}>
                    Show when you've read messages
                  </Text>
                </View>
                <Switch
                  value={settings.readReceipts}
                  onValueChange={(value) => 
                    onSettingsChange({ ...settings, readReceipts: value })
                  }
                  trackColor={{ false: '#4b5563', true: '#d4af37' }}
                  thumbColor={settings.readReceipts ? '#fff' : '#d1d5db'}
                />
              </View>
            </View>

            {/* Appearance Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Appearance</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Compact Mode</Text>
                  <Text style={styles.settingDescription}>
                    Use smaller message spacing
                  </Text>
                </View>
                <Switch
                  value={settings.compactMode}
                  onValueChange={(value) => 
                    onSettingsChange({ ...settings, compactMode: value })
                  }
                  trackColor={{ false: '#4b5563', true: '#d4af37' }}
                  thumbColor={settings.compactMode ? '#fff' : '#d1d5db'}
                />
              </View>
            </View>

            {/* About Section */}
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>About</Text>
              <Text style={styles.aboutText}>GoblinCave v1.0.0</Text>
              <Text style={styles.aboutText}>Made with ⚔️ by Goblin Developers</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Main Chat App Component
const ChatApp = ({ user, onLogout, initialShowServerSetup }) => {
  const [servers, setServers] = useState([
    { id: 1, name: 'Goblin Hoard', icon: '💰', color: '#d4af37' },
    { id: 2, name: 'Dark Cave', icon: '🦇', color: '#2d1b4e' },
  ]);

  const [channels] = useState([
    { id: 1, name: 'general-chaos', type: 'text', icon: '#' },
    { id: 2, name: 'treasure-finds', type: 'text', icon: '#' },
    { id: 3, name: 'goblin-gossip', type: 'text', icon: '#' },
    { id: 4, name: 'raid-planning', type: 'text', icon: '#' },
    { id: 5, name: 'cave-acoustics', type: 'voice', icon: '🔊' },
    { id: 6, name: 'midnight-howling', type: 'voice', icon: '🔊' },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, user: 'GrogTheGreedy', avatar: '👹', message: 'Found shiny rock!', timestamp: '12:34 PM', color: '#d4af37' },
    { id: 2, user: 'SneakyNibbler', avatar: '👺', message: 'Mine mine mine!', timestamp: '12:35 PM', color: '#8b4513' },
    { id: 3, user: 'ChiefGrimtooth', avatar: '👑', message: 'All goblins report to cave entrance', timestamp: '12:36 PM', color: '#4169e1' },
  ]);

  const [onlineUsers, setOnlineUsers] = useState([
    { name: 'GrogTheGreedy', status: 'ONLINE', customStatus: 'Hoarding treasures', avatar: '👹' },
    { name: 'SneakyNibbler', status: 'AWAY', customStatus: 'Sneaking around', avatar: '👺' },
    { name: 'ChiefGrimtooth', status: 'DO_NOT_DISTURB', customStatus: 'Planning schemes', avatar: '👑' },
    { name: 'ToadstoolTina', status: 'OFFLINE', customStatus: 'Foraging', avatar: '🍄' },
  ]);

  const [currentServer, setCurrentServer] = useState(servers[0]);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(true);
  const [showServerSetup, setShowServerSetup] = useState(initialShowServerSetup);
  const [showSettings, setShowSettings] = useState(false);
  const [userStatus, setUserStatus] = useState('ONLINE');
  const [settings, setSettings] = useState({
    pushNotifications: true,
    messageSounds: true,
    showOnlineStatus: true,
    readReceipts: true,
    compactMode: false,
  });

  const scrollViewRef = useRef(null);
  const sidebarAnim = useRef(new Animated.Value(0)).current;
  const userPanelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: showSidebar ? 0 : -240,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSidebar]);

  useEffect(() => {
    Animated.timing(userPanelAnim, {
      toValue: showUserPanel ? 0 : 240,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showUserPanel]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const newMessage = {
        id: messages.length + 1,
        user: user.username,
        avatar: '🎭',
        message: inputMessage,
        timestamp: timestamp,
        color: '#ff6b35'
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleCreateServer = (serverData) => {
    const newServer = {
      id: servers.length + 1,
      name: serverData.name,
      icon: serverData.icon,
      color: '#d4af37'
    };
    setServers([...servers, newServer]);
    setCurrentServer(newServer);
    Alert.alert('Success', `Server "${serverData.name}" created!`);
  };

  const handleJoinServer = (inviteCode) => {
    Alert.alert('Success', `Joined server with code: ${inviteCode}`);
  };

  const handleStatusChange = (newStatus) => {
    setUserStatus(newStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.mainContainer}>
          {/* Server List */}
          <View style={styles.serverList}>
            <TouchableOpacity style={styles.homeButton}>
              <Text style={styles.homeIcon}>👑</Text>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {servers.map(server => (
                <TouchableOpacity
                  key={server.id}
                  style={[
                    styles.serverIcon,
                    currentServer.id === server.id && styles.serverIconActive
                  ]}
                  onPress={() => setCurrentServer(server)}
                >
                  <Text style={styles.serverIconText}>{server.icon}</Text>
                  {currentServer.id === server.id && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.addServer}
              onPress={() => setShowServerSetup(true)}
            >
              <Text style={styles.addServerText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Sidebar */}
          <Animated.View 
            style={[
              styles.sidebar,
              { transform: [{ translateX: sidebarAnim }] }
            ]}
          >
            <View style={styles.serverHeader}>
              <Text style={styles.serverHeaderText}>
                {currentServer.name} ⚔️
              </Text>
            </View>
            
            <ScrollView style={styles.channelsList}>
              <Text style={styles.categoryLabel}>📜 TEXT CHANNELS</Text>
              {channels.filter(ch => ch.type === 'text').map(channel => (
                <TouchableOpacity
                  key={channel.id}
                  style={[
                    styles.channel,
                    currentChannel.id === channel.id && styles.channelActive
                  ]}
                  onPress={() => setCurrentChannel(channel)}
                >
                  <Text style={styles.channelIcon}>{channel.icon}</Text>
                  <Text style={[
                    styles.channelText,
                    currentChannel.id === channel.id && styles.channelTextActive
                  ]}>
                    {channel.name}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <Text style={styles.categoryLabel}>🔊 VOICE CHANNELS</Text>
              {channels.filter(ch => ch.type === 'voice').map(channel => (
                <TouchableOpacity
                  key={channel.id}
                  style={[
                    styles.channel,
                    currentChannel.id === channel.id && styles.channelActive
                  ]}
                  onPress={() => setCurrentChannel(channel)}
                >
                  <Text style={styles.channelIcon}>{channel.icon}</Text>
                  <Text style={[
                    styles.channelText,
                    currentChannel.id === channel.id && styles.channelTextActive
                  ]}>
                    {channel.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.userArea}>
              <View style={styles.currentUserAvatar}>
                <Text style={styles.currentUserAvatarText}>🎭</Text>
                <View style={[
                  styles.userStatusDot,
                  { backgroundColor: USER_STATUSES[userStatus].color }
                ]} />
              </View>
              <View style={styles.currentUserInfo}>
                <Text style={styles.currentUserName}>{user.username}</Text>
                <Text style={styles.currentUserStatus}>
                  {USER_STATUSES[userStatus].label}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.settingsBtn} 
                onPress={() => setShowSettings(true)}
              >
                <Text style={styles.settingsBtnText}>⚙️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsBtn} onPress={onLogout}>
                <Text style={styles.settingsBtnText}>🚪</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.menuBtn}
                onPress={() => setShowSidebar(!showSidebar)}
              >
                <Text style={styles.menuBtnText}>☰</Text>
              </TouchableOpacity>
              
              <Text style={styles.hashIcon}>#</Text>
              <Text style={styles.channelName}>{currentChannel.name}</Text>
              
              <View style={styles.spacer} />
              
              <TouchableOpacity 
                style={styles.toolbarBtn}
                onPress={() => setShowUserPanel(!showUserPanel)}
              >
                <Text style={styles.toolbarBtnText}>👥</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
            >
              {messages.map(msg => (
                <View key={msg.id} style={styles.message}>
                  <View style={[styles.messageAvatar, { borderColor: msg.color }]}>
                    <Text style={styles.messageAvatarText}>{msg.avatar}</Text>
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <Text style={[styles.messageUser, { color: msg.color }]}>
                        {msg.user}
                      </Text>
                      <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
                    </View>
                    <Text style={styles.messageText}>{msg.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.inputIconBtn}>
                  <Text style={styles.inputIcon}>➕</Text>
                </TouchableOpacity>
                
                <TextInput
                  style={styles.input}
                  placeholder={`Send message to #${currentChannel.name}...`}
                  placeholderTextColor="#8b7355"
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  onSubmitEditing={sendMessage}
                  returnKeyType="send"
                />
                
                <TouchableOpacity style={styles.inputIconBtn}>
                  <Text style={styles.inputIcon}>😊</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                  <Text style={styles.sendBtnText}>➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* User Panel */}
          <Animated.View 
            style={[
              styles.userPanel,
              { transform: [{ translateX: userPanelAnim }] }
            ]}
          >
            <View style={styles.userPanelHeader}>
              <Text style={styles.userPanelHeaderText}>
                GOBLINS — {onlineUsers.filter(u => u.status !== 'OFFLINE').length + 1}
              </Text>
            </View>
            
            <ScrollView style={styles.userList}>
              {/* Current user */}
              <TouchableOpacity style={styles.userItem}>
                <View style={styles.userItemAvatar}>
                  <Text style={styles.userItemAvatarText}>🎭</Text>
                  <View style={[
                    styles.statusIndicator,
                    { backgroundColor: USER_STATUSES[userStatus].color }
                  ]} />
                </View>
                <View style={styles.userItemInfo}>
                  <Text style={styles.userItemName}>{user.username} (You)</Text>
                  <Text style={styles.userItemStatus}>
                    {USER_STATUSES[userStatus].label}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Other users - Online/Away/DND */}
              {onlineUsers
                .filter(u => u.status !== 'OFFLINE')
                .map((user, index) => (
                <TouchableOpacity key={index} style={styles.userItem}>
                  <View style={styles.userItemAvatar}>
                    <Text style={styles.userItemAvatarText}>{user.avatar}</Text>
                    <View style={[
                      styles.statusIndicator,
                      { backgroundColor: USER_STATUSES[user.status].color }
                    ]} />
                  </View>
                  <View style={styles.userItemInfo}>
                    <Text style={styles.userItemName}>{user.name}</Text>
                    <Text style={styles.userItemStatus}>
                      {user.customStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Offline users */}
              {onlineUsers.filter(u => u.status === 'OFFLINE').length > 0 && (
                <>
                  <Text style={styles.categoryLabel}>OFFLINE</Text>
                  {onlineUsers
                    .filter(u => u.status === 'OFFLINE')
                    .map((user, index) => (
                    <TouchableOpacity key={index} style={styles.userItem}>
                      <View style={styles.userItemAvatar}>
                        <Text style={styles.userItemAvatarText}>{user.avatar}</Text>
                        <View style={[
                          styles.statusIndicator,
                          { backgroundColor: USER_STATUSES[user.status].color }
                        ]} />
                      </View>
                      <View style={styles.userItemInfo}>
                        <Text style={[styles.userItemName, { opacity: 0.5 }]}>
                          {user.name}
                        </Text>
                        <Text style={styles.userItemStatus}>Offline</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <ServerSetupModal
        visible={showServerSetup}
        onClose={() => setShowServerSetup(false)}
        onCreateServer={handleCreateServer}
        onJoinServer={handleJoinServer}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        userStatus={userStatus}
        onStatusChange={handleStatusChange}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </SafeAreaView>
  );
};

// Main App Component with Authentication Flow
const GoblinCave = () => {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [showServerSetupOnLogin, setShowServerSetupOnLogin] = useState(false);

  const handleGetStarted = () => {
    setCurrentScreen('login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowServerSetupOnLogin(false);
    setCurrentScreen('chat');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowServerSetupOnLogin(true); // Show server setup for new users
    setCurrentScreen('chat');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to leave the cave?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            setUser(null);
            setShowServerSetupOnLogin(false);
            setCurrentScreen('landing');
          }
        }
      ]
    );
  };

  const switchToRegister = () => {
    setCurrentScreen('register');
  };

  const switchToLogin = () => {
    setCurrentScreen('login');
  };

  if (currentScreen === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen onLogin={handleLogin} onSwitchToRegister={switchToRegister} />;
  }

  if (currentScreen === 'register') {
    return <RegisterScreen onRegister={handleRegister} onSwitchToLogin={switchToLogin} />;
  }

  if (currentScreen === 'chat' && user) {
    return (
      <ChatApp 
        user={user} 
        onLogout={handleLogout}
        initialShowServerSetup={showServerSetupOnLogin}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  // Landing Page Styles
  landingContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  landingContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  landingHeader: {
    alignItems: 'center',
    marginTop: 60,
  },
  landingIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  landingTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: 12,
    textAlign: 'center',
  },
  landingSubtitle: {
    fontSize: 18,
    color: '#e8d5a8',
    textAlign: 'center',
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  landingFeatures: {
    gap: 24,
  },
  featureItem: {
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#e8d5a8',
    opacity: 0.8,
    lineHeight: 22,
  },
  landingActions: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#d4af37',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0e27',
  },
  landingFooter: {
    fontSize: 14,
    color: '#8b7355',
    textAlign: 'center',
  },

  // Auth Screens Styles
  authContainer: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  authContent: {
    flex: 1,
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  authIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#8b7355',
  },
  authForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8d5a8',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIconText: {
    fontSize: 20,
    marginRight: 12,
  },
  authInput: {
    flex: 1,
    fontSize: 16,
    color: '#e8d5a8',
    paddingVertical: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#d4af37',
  },
  authButton: {
    backgroundColor: '#d4af37',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0e27',
  },
  authSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authSwitchText: {
    fontSize: 14,
    color: '#8b7355',
  },
  authSwitchLink: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#8b7355',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'rgba(15, 20, 35, 0.98)',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  settingsModal: {
    backgroundColor: 'rgba(15, 20, 35, 0.98)',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d4af37',
  },
  modalClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#8b7355',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#d4af37',
  },
  tabText: {
    fontSize: 16,
    color: '#8b7355',
  },
  tabTextActive: {
    color: '#d4af37',
    fontWeight: '600',
  },
  tabContent: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8d5a8',
    marginBottom: 12,
    marginTop: 16,
  },
  modalDescription: {
    fontSize: 14,
    color: '#8b7355',
    marginBottom: 16,
    lineHeight: 20,
  },
  iconScroll: {
    marginBottom: 8,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconOptionActive: {
    borderColor: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  iconOptionText: {
    fontSize: 28,
  },
  modalInputWrapper: {
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalInput: {
    fontSize: 16,
    color: '#e8d5a8',
    paddingVertical: 12,
  },
  modalButton: {
    backgroundColor: '#d4af37',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0e27',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#8b7355',
  },

  // Settings Styles
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b7355',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#d4af37',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  profileAvatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e8d5a8',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8b7355',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(26, 31, 58, 0.4)',
  },
  statusOptionActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.4)',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  statusLabel: {
    flex: 1,
    fontSize: 16,
    color: '#e8d5a8',
  },
  statusLabelActive: {
    fontWeight: '600',
    color: '#d4af37',
  },
  statusCheck: {
    fontSize: 18,
    color: '#d4af37',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8d5a8',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#8b7355',
    lineHeight: 18,
  },
  aboutText: {
    fontSize: 14,
    color: '#8b7355',
    marginBottom: 8,
  },

  // Chat App Styles
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0a0e27',
  },
  
  serverList: {
    width: 72,
    backgroundColor: 'rgba(10, 14, 27, 0.95)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(212, 175, 55, 0.2)',
    alignItems: 'center',
    paddingVertical: 12,
  },
  homeButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#d4af37',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  homeIcon: {
    fontSize: 24,
  },
  divider: {
    width: 36,
    height: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 1,
    marginVertical: 8,
  },
  serverIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 31, 58, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  serverIconActive: {
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderColor: '#d4af37',
  },
  serverIconText: {
    fontSize: 24,
  },
  activeIndicator: {
    position: 'absolute',
    left: -8,
    width: 4,
    height: 40,
    backgroundColor: '#d4af37',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  addServer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addServerText: {
    fontSize: 24,
    color: '#d4af37',
  },

  sidebar: {
    width: 240,
    backgroundColor: 'rgba(15, 20, 35, 0.95)',
    borderRightWidth: 2,
    borderRightColor: 'rgba(212, 175, 55, 0.2)',
  },
  serverHeader: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  serverHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e8d5a8',
  },
  channelsList: {
    flex: 1,
    padding: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b7355',
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 8,
    letterSpacing: 1,
  },
  channel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
  },
  channelActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  channelIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#8b7355',
  },
  channelText: {
    fontSize: 15,
    color: '#e8d5a8',
  },
  channelTextActive: {
    color: '#d4af37',
    fontWeight: '600',
  },
  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(10, 14, 27, 0.6)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  currentUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d4af37',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    position: 'relative',
  },
  currentUserAvatarText: {
    fontSize: 18,
  },
  userStatusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(10, 14, 27, 0.6)',
  },
  currentUserInfo: {
    flex: 1,
    marginLeft: 10,
  },
  currentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8d5a8',
  },
  currentUserStatus: {
    fontSize: 11,
    color: '#8b7355',
  },
  settingsBtn: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  settingsBtnText: {
    fontSize: 16,
  },

  mainContent: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 27, 0.4)',
  },
  chatHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15, 20, 35, 0.7)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  menuBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  menuBtnText: {
    fontSize: 20,
    color: '#d4af37',
  },
  hashIcon: {
    fontSize: 24,
    color: '#d4af37',
    marginRight: 8,
  },
  channelName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d4af37',
  },
  spacer: {
    flex: 1,
  },
  toolbarBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarBtnText: {
    fontSize: 20,
  },

  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(26, 31, 58, 0.5)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageAvatarText: {
    fontSize: 24,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  messageUser: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#8b7355',
  },
  messageText: {
    fontSize: 15,
    color: '#e8d5a8',
    lineHeight: 22,
  },

  inputContainer: {
    padding: 16,
    backgroundColor: 'rgba(10, 14, 27, 0.8)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(212, 175, 55, 0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 58, 0.6)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputIconBtn: {
    padding: 4,
  },
  inputIcon: {
    fontSize: 18,
    color: '#8b7355',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#e8d5a8',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#d4af37',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendBtnText: {
    fontSize: 18,
    color: '#0a0e27',
  },

  userPanel: {
    width: 240,
    backgroundColor: 'rgba(15, 20, 35, 0.95)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(212, 175, 55, 0.2)',
  },
  userPanelHeader: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  userPanelHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8d5a8',
    letterSpacing: 1,
  },
  userList: {
    flex: 1,
    padding: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  userItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 31, 58, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  userItemAvatarText: {
    fontSize: 18,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(15, 20, 35, 0.9)',
  },
  userItemInfo: {
    flex: 1,
  },
  userItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e8d5a8',
  },
  userItemStatus: {
    fontSize: 12,
    color: '#8b7355',
  },
});

export default GoblinCave;