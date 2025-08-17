import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function JoinRoomScreen() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert('Error', 'Please enter a room code');
      return;
    }

    setLoading(true);
    
    // In a real app, you'd validate the room code with your backend
    setTimeout(() => {
      router.push(`/(app)/room/${roomCode.toUpperCase()}?role=guest`);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#3b82f6" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Join Room</Text>
        <Text style={styles.subtitle}>Enter the room code to join an audio session</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter room code (e.g., ABC123)"
            value={roomCode}
            onChangeText={setRoomCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[styles.joinButton, loading && styles.buttonDisabled]}
            onPress={joinRoom}
            disabled={loading || !roomCode.trim()}
          >
            <Text style={styles.joinButtonText}>
              {loading ? 'Joining...' : 'Join Room'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    padding: 16,
    marginTop: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  form: {
    gap: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    backgroundColor: 'white',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
  },
  joinButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});