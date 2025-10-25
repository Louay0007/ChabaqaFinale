import { ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface ProductsHeaderProps {
  totalProducts: number;
  purchasedCount: number;
  freeCount: number;
  premiumCount: number;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  totalProducts,
  purchasedCount,
  freeCount,
  premiumCount,
}) => {
  return (
    <View style={styles.header}>
      {/* Background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <View style={styles.headerContent}>
        {/* Left side - Title and subtitle */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <ShoppingBag size={20} color="#fff" />
            <Text style={styles.title} numberOfLines={1}>Digital Marketplace</Text>
          </View>
          <Text style={styles.subtitle}>
            Download premium digital resources from our community creators
          </Text>
        </View>
        
        {/* Right side - Stats horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalProducts}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{purchasedCount}</Text>
            <Text style={styles.statLabel}>Purchased</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{freeCount}</Text>
            <Text style={styles.statLabel}>Free</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{premiumCount}</Text>
            <Text style={styles.statLabel}>Premium</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
