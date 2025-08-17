import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Audio } from 'expo-av';
import { 
  Play, 
  Pause, 
  Square, 
  Share2, 
  ArrowLeft, 
  Users,
  Crown,
  User
} from 'lucide-react-native';

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'guest';
}

export default function RoomScreen() {
  const { id, role, audio } = useLocalSearchParams<{
    id: string;
    role: 'host' | 'guest';
    audio?: string;
  }>();
  const router = useRouter();
  const { user } = useUser();
  
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [participants] = useState<Participant[]>([
    { id: '1', name: user?.emailAddresses[0]?.emailAddress || 'You', role: role || 'guest' },
    { id: '2', name: 'user@example.com', role: 'guest' },
    { id: '3', name: 'guest@example.com', role: 'guest' },
  ]);

  const isHost = role === 'host';

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadAudio = async () => {
    if (!audio && isHost) return;
    
    // In a real app, you'd load the audio from your backend
    // For demo purposes, we'll use a placeholder
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { shouldPlay: false }
    );
    setSound(sound);
    
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
    }
  };

  const togglePlayback = async () => {
    if (!sound) {
      await loadAudio();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setPosition(0);
    }
  };

  const shareRoom = async () => {
    try {
      await Share.share({
        message: `Join my Alien Music session with code: ${id}`,
        title: 'Alien Music Room',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const leaveRoom = () => {
    if (isHost) {
      // End session for all participants
      router.replace('/(app)/(tabs)');
    } else {
      // Just leave as guest
      router.back();
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderParticipant = ({ item }: { item: Participant }) => (
    <View style={styles.participant}>
      <View style={styles.participantInfo}>
        {item.role === 'host' ? (
          <Crown size={16} color="#f59e0b" />
        ) : (
          <User size={16} color="#64748b" />
        )}
        <Text style={styles.participantName}>{item.name}</Text>
      </View>
      <Text style={styles.participantRole}>{item.role}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.roomCode}>Room: {id}</Text>
        <TouchableOpacity onPress={shareRoom}>
          <Share2 size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>
            {audio || 'Audio File'} {isHost && '(Host Controls)'}
          </Text>
          
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: duration ? `${(position / duration) * 100}%` : '0%' }]} />
          </View>

          {isHost && (
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={togglePlayback}
              >
                {isPlaying ? (
                  <Pause size={24} color="white" />
                ) : (
                  <Play size={24} color="white" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={stopPlayback}
              >
                <Square size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {!isHost && (
            <View style={styles.guestInfo}>
              <Text style={styles.guestText}>
                {isPlaying ? 'Playing' : 'Paused'} • Synced with host
              </Text>
            </View>
          )}
        </View>

        <View style={styles.participantsSection}>
          <View style={styles.participantsHeader}>
            <Users size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Participants ({participants.length})</Text>
          </View>
          
          <FlatList
            data={participants}
            renderItem={renderParticipant}
            keyExtractor={(item) => item.id}
            style={styles.participantsList}
          />
        </View>

        <TouchableOpacity style={styles.leaveButton} onPress={leaveRoom}>
          <Text style={styles.leaveButtonText}>
            {isHost ? 'End Session' : 'Leave Room'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 56,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  roomCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  audioSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 24,
  },
  progress: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  controlButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: '#64748b',
  },
  guestInfo: {
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  guestText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  participantsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  participantsList: {
    flex: 1,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  participantRole: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  leaveButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});