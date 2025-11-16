import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import { getProductById } from '../../../../../lib/mock-data';
import BottomNavigation from '../../../_components/BottomNavigation';
import { styles } from '../styles';
import { CommunityTab } from './_components/CommunityTab';
import { FilesTab } from './_components/FilesTab';
import { LicenseTab } from './_components/LicenseTab';
import { OverviewTab } from './_components/OverviewTab';
import { ProductHeader } from './_components/ProductHeader';
import { ProductTabs } from './_components/ProductTabs';

export default function ProductDetailScreen() {
  const { slug, productId } = useLocalSearchParams<{ slug: string; productId: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const product = getProductById(productId || '');
  
  // Mock data for demonstration
  const hasAccess = false; // Change to true to test purchased state
  const userIsMember = true; // Change to false to test non-member state

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.notFound}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Transform product data for components
  const transformedProduct = {
    id: product.id,
    title: product.title || 'Untitled Product',
    creator: {
      name: product.creator ? String(product.creator) : 'Anonymous Creator',
      avatar: undefined,
    },
    rating: 4.9,
    reviewCount: 127,
    image: product.images?.[0],
    description: product.description || 'No description available.',
    features: [
      '1000+ vector icons',
      '5 different styles',
      'SVG and PNG formats',
      'Free lifetime updates'
    ],
    type: 'Digital Assets',
    category: 'Design',
    price: product.price || 0,
    fileTypes: ['SVG', 'PNG'],
    license: undefined,
    terms: undefined,
    usage: undefined,
  };

  // Mock files data
  const files = [
    { id: '1', name: 'Icons_SVG.zip', type: 'SVG', size: '12MB', isPaid: true, isDownloaded: false },
    { id: '2', name: 'Icons_PNG.zip', type: 'PNG', size: '28MB', isPaid: true, isDownloaded: false },
    { id: '3', name: 'Documentation.pdf', type: 'PDF', size: '2MB', isPaid: false, isDownloaded: true },
  ];

  // Mock comments data
  const comments = [
    {
      id: '1',
      user: { name: 'John Smith', avatar: undefined },
      text: 'Excellent product! The icons are very high quality and easy to use.',
      createdAt: '2024-01-15T10:30:00Z',
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      user: { name: 'Sarah Johnson', avatar: undefined },
      text: 'Perfect for my design projects. Very clear documentation.',
      createdAt: '2024-01-14T15:45:00Z',
      likes: 8,
      isLiked: true,
    },
  ];

  const tabs = [
    { key: 'overview', title: 'Overview' },
    { key: 'files', title: 'Files' },
    { key: 'license', title: 'License' },
    { key: 'community', title: 'Community' }
  ];

  const handleDownload = (fileId: string) => {
    console.log('Download file:', fileId);
    // Download implementation
  };

  const handlePurchase = () => {
    console.log('Purchase product:', productId);
    // Purchase implementation
  };

  const handleJoinCommunity = () => {
    console.log('Join community');
    // Join community implementation
  };

  const handleLikeComment = (commentId: string) => {
    console.log('Like comment:', commentId);
    // Like comment implementation
  };

  const handleReplyToComment = (commentId: string) => {
    console.log('Reply to comment:', commentId);
    // Reply to comment implementation
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab product={transformedProduct} />;
      case 'files':
        return (
          <FilesTab 
            files={files} 
            hasAccess={hasAccess} 
            onDownload={handleDownload} 
            onPurchase={handlePurchase} 
          />
        );
      case 'license':
        return <LicenseTab product={transformedProduct} />;
      case 'community':
        return (
          <CommunityTab 
            comments={comments}
            userIsMember={userIsMember}
            onJoinCommunity={handleJoinCommunity}
            onLikeComment={handleLikeComment}
            onReplyToComment={handleReplyToComment}
          />
        );
      default:
        return <OverviewTab product={transformedProduct} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProductHeader product={transformedProduct} />
        <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </ScrollView>

      <BottomNavigation slug={slug} currentTab="products" />
    </SafeAreaView>
  );
}

