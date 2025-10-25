import { useAuth } from '@/hooks/use-auth';
import { colors } from '@/lib/design-tokens';
import { Community } from '@/lib/mock-data';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { modalStyles } from './modal-styles';

interface JoinCommunityModalProps {
  visible: boolean;
  onClose: () => void;
  community: Community;
}

export default function JoinCommunityModal({ visible, onClose, community }: JoinCommunityModalProps) {
  const { login } = useAuth();
  const router = useRouter();

  const handleJoin = async () => {
    try {
      // In a real app, you would first process payment if it's a paid community
      // Mock login with a user object
      login({ 
        sub: '999',
        email: 'guest@example.com',
        name: 'Guest User',
        role: 'member'
      });
      onClose();
      router.push(`/(community)/${community.slug}/(loggedUser)/home`);
    } catch (error) {
      console.error('Failed to join community:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <Text style={modalStyles.modalTitle}>Join Community</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <X size={24} color={colors.gray500} />
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.modalBody}>
            <Text style={modalStyles.joinCommunityName}>{community.name}</Text>
            
            <Text style={modalStyles.sectionTitle}>About this community</Text>
            <Text style={modalStyles.descriptionText}>{community.longDescription}</Text>
            
            <Text style={modalStyles.sectionTitle}>What you'll get</Text>
            <View style={modalStyles.joinCommunityBenefitsList}>
              {community.settings?.benefits?.map((benefit: string, index: number) => (
                <View key={index} style={modalStyles.joinCommunityBenefitItem}>
                  <Text style={modalStyles.descriptionText}>• {benefit}</Text>
                </View>
              ))}
            </View>

            <Text style={modalStyles.joinCommunityPricingInfo}>
              {community.price > 0 
                ? `$${community.price} per ${community.priceType === 'monthly' ? 'month' : 'year'}`
                : 'Free'}
            </Text>

            {community.price > 0 && (
              <Text style={modalStyles.joinCommunityPricingNote}>
                You can cancel your subscription at any time.
              </Text>
            )}
          </ScrollView>

          <View style={modalStyles.modalFooter}>
            <TouchableOpacity style={modalStyles.secondaryButton} onPress={onClose}>
              <Text style={modalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={modalStyles.primaryButton} onPress={handleJoin}>
              <Text style={modalStyles.primaryButtonText}>
                {community.price > 0 ? 'Subscribe' : 'Join for Free'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
