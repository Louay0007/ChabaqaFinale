import React from 'react';
import { FlatList } from 'react-native';
import { Product, Purchase } from '../../../../../lib/mock-data';
import { styles } from '../styles';
import { EmptyState } from './EmptyState';
import { ProductCard } from './ProductCard';

interface ProductsListProps {
  products: Product[];
  userPurchases: Purchase[];
  searchQuery: string;
  onProductPress: (productId: string) => void;
  onPurchase: (product: Product) => void;
  onDownload: (product: Product) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  userPurchases,
  searchQuery,
  onProductPress,
  onPurchase,
  onDownload,
}) => {
  const renderProductItem = ({ item }: { item: Product }) => {
    const isPurchased = userPurchases.some((p: Purchase) => p.productId === item.id);

    return (
      <ProductCard
        product={item}
        isPurchased={isPurchased}
        onPress={() => onProductPress(item.id)}
        onPurchase={() => onPurchase(item)}
        onDownload={() => onDownload(item)}
      />
    );
  };

  if (products.length === 0) {
    return <EmptyState searchQuery={searchQuery} />;
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProductItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.productsList}
      showsVerticalScrollIndicator={false}
      numColumns={2}
      columnWrapperStyle={styles.row}
    />
  );
};
