import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, ArrowLeft } from 'lucide-react-native';

export default function CreateRoomScreen() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick audio file');
    }
  };

  const createRoom = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select an audio file first');
      return;
    }

    setLoading(true);
    
    // Generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // In a real app, you'd upload the file and create the room via your backend
    setTimeout(() => {
      router.push(`/(app)/room/${roomId}?role=host&audio=${encodeURIComponent(selectedFile.name)}`);
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#3b82f6" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Create Room</Text>
        <Text style={styles.subtitle}>Upload an audio file to start a synchronized session</Text>

        <TouchableOpacity style={styles.uploadArea} onPress={pickAudioFile}>
          <Upload size={32} color="#64748b" />
          <Text style={styles.uploadText}>
            {selectedFile ? selectedFile.name : 'Tap to select audio file'}
          </Text>
          <Text style={styles.uploadSubtext}>
            Supports MP3, WAV, M4A, and other audio formats
          </Text>
        </TouchableOpacity>

        {selectedFile && (
          <TouchableOpacity
            style={[styles.createButton, loading && styles.buttonDisabled]}
            onPress={createRoom}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating Room...' : 'Create Room'}
            </Text>
          </TouchableOpacity>
        )}
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
  uploadArea: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});