import { Download, FileText } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface ResourcesTabProps {}

export const ResourcesTab: React.FC<ResourcesTabProps> = () => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <Text style={styles.resourceTitle}>Chapter Resources</Text>
          <Text style={styles.resourceDescription}>
            Additional materials for this chapter
          </Text>
        </View>

        <View style={styles.resourceItem}>
          <View style={styles.resourceInfo}>
            <FileText size={20} color="#3b82f6" />
            <View style={styles.resourceDetails}>
              <Text style={styles.resourceName}>Chapter Slides</Text>
              <Text style={styles.resourceMeta}>PDF • 2.3 MB</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.resourceButton}>
            <Download size={16} color="#6b7280" />
            <Text style={styles.resourceButtonText}>Download</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resourceItem}>
          <View style={styles.resourceInfo}>
            <FileText size={20} color="#10b981" />
            <View style={styles.resourceDetails}>
              <Text style={styles.resourceName}>Source Code</Text>
              <Text style={styles.resourceMeta}>ZIP • 1.1 MB</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.resourceButton}>
            <Download size={16} color="#6b7280" />
            <Text style={styles.resourceButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
