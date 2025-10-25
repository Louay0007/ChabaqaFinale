import { Download, FileText, Lock, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  url?: string;
  isPaid?: boolean;
  isDownloaded?: boolean;
  downloadProgress?: number;
}

interface FilesTabProps {
  files: File[];
  hasAccess: boolean;
  onDownload: (fileId: string) => void;
  onPurchase: () => void;
}

export const FilesTab: React.FC<FilesTabProps> = ({ 
  files, 
  hasAccess, 
  onDownload, 
  onPurchase 
}) => {
  const getFileIcon = (type: string) => {
    const iconProps = { size: 20, color: '#6366f1' };
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  const renderFileAction = (file: File) => {
    if (!hasAccess && file.isPaid) {
      return (
        <TouchableOpacity 
          style={styles.buyButton} 
          onPress={onPurchase}
        >
          <ShoppingCart size={14} color="#fff" />
          <Text style={styles.buyButtonText}>Acheter</Text>
        </TouchableOpacity>
      );
    }

    if (!hasAccess) {
      return (
        <TouchableOpacity 
          style={styles.lockedButton}
          disabled
        >
          <Lock size={14} color="#666" />
          <Text style={styles.lockedButtonText}>Verrouillé</Text>
        </TouchableOpacity>
      );
    }

    if (file.isDownloaded) {
      return (
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={() => onDownload(file.id)}
        >
          <Download size={14} color="#fff" />
          <Text style={styles.downloadButtonText}>Ouvrir</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.downloadButton}
        onPress={() => onDownload(file.id)}
      >
        <Download size={14} color="#fff" />
        <Text style={styles.downloadButtonText}>Télécharger</Text>
      </TouchableOpacity>
    );
  };

  const renderFileItem = ({ item }: { item: File }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <View style={styles.fileIcon}>
          {getFileIcon(item.type)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.fileName}>{item.name}</Text>
          <Text style={styles.fileDetails}>
            {item.type.toUpperCase()} • {item.size}
          </Text>
          {item.downloadProgress !== undefined && item.downloadProgress < 100 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${item.downloadProgress}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>
      </View>
      {renderFileAction(item)}
    </View>
  );

  return (
    <View style={styles.tabContent}>
      {files.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>Aucun fichier disponible.</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};
