import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles';

interface OverviewTabProps {
  product: {
    description?: string;
    features?: string[];
    type?: string;
    category?: string;
    price?: number;
    fileTypes?: string[];
  };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ product }) => {
  const { description, features, type, category, price, fileTypes } = product;

  return (
    <View style={styles.tabContent}>
      {/* Description Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Description</Text>
        <Text style={styles.cardText}>
          {description || 'Aucune description disponible pour ce produit.'}
        </Text>
      </View>

      {/* Features Card */}
      {features && features.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.featureTitle}>Caractéristiques principales</Text>
          {features.map((feature, index) => (
            <Text key={index} style={styles.cardText}>
              • {feature}
            </Text>
          ))}
        </View>
      )}

      {/* Product Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Détails du produit</Text>
        
        {type && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Type</Text>
            <Text style={styles.detailsValue}>{type}</Text>
          </View>
        )}
        
        {category && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Catégorie</Text>
            <Text style={styles.detailsValue}>{category}</Text>
          </View>
        )}
        
        {price !== undefined && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Prix</Text>
            <Text style={styles.detailsValue}>
              {price === 0 ? 'Gratuit' : `${price} DT`}
            </Text>
          </View>
        )}
        
        {fileTypes && fileTypes.length > 0 && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Formats</Text>
            <View style={styles.fileTypes}>
              {fileTypes.map((type, index) => (
                <View key={index} style={styles.fileTypeBadge}>
                  <Text style={styles.fileTypeText}>{type.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
