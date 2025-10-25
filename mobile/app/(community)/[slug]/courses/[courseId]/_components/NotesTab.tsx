import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface NotesTabProps {}

export const NotesTab: React.FC<NotesTabProps> = () => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.noteCard}>
        <View style={styles.noteCardYellow}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteText}>
              Remember to use useEffect for side effects
            </Text>
            <Text style={styles.noteTime}>2 minutes ago</Text>
          </View>
          <TouchableOpacity style={styles.noteEditButton}>
            <Text style={styles.noteEditText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteCardBlue}>
          <View style={styles.noteHeader}>
            <Text style={styles.noteText}>
              Component composition is key for reusability
            </Text>
            <Text style={styles.noteTime}>5 minutes ago</Text>
          </View>
          <TouchableOpacity style={styles.noteEditButton}>
            <Text style={styles.noteEditText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
