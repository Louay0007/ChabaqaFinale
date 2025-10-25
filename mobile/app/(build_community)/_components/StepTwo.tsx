import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import ChevronDownIcon from './icons/ChevronDownIcon';
import DollarIcon from './icons/DollarIcon';
import GlobeIcon from './icons/GlobeIcon';
import LockIcon from './icons/LockIcon';
import UsersIcon from './icons/UsersIcon';

interface StepTwoProps {
  formData: {
    status: 'public' | 'private';
    joinFee: 'free' | 'paid';
    feeAmount: string;
  };
  updateFormData: (field: string, value: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  showCurrencyModal: boolean;
  setShowCurrencyModal: (show: boolean) => void;
  currencies: Array<{ code: string; name: string; symbol: string; }>;
}

const StepTwo = ({ formData, updateFormData, selectedCurrency, setSelectedCurrency, showCurrencyModal, setShowCurrencyModal, currencies }: StepTwoProps) => (
  <>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Community Settings</Text>
      <Text style={styles.stepSubtitle}>Configure your community access and pricing.</Text>
      <Text style={styles.sectionTitle}>Community Status</Text>
      <View style={styles.optionSection}>
        <TouchableOpacity 
          style={[styles.optionCard, formData.status === 'public' && styles.optionCardSelected]} 
          onPress={() => updateFormData('status', 'public')}
          activeOpacity={1}
        >
          <View style={styles.optionIconContainer}><LinearGradient colors={['#10B981', '#059669']} style={styles.optionIcon}><GlobeIcon /></LinearGradient></View>
          <View style={styles.optionContent}><Text style={styles.optionTitle}>Public</Text><Text style={styles.optionDescription}>Anyone can find and join your community</Text></View>
          <View style={[styles.radioButton, formData.status === 'public' && styles.radioButtonSelected]} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.optionCard, formData.status === 'private' && styles.optionCardSelected]} 
          onPress={() => updateFormData('status', 'private')}
          activeOpacity={1}
        >
          <View style={styles.optionIconContainer}><LinearGradient colors={['#EC4899', '#DB2777']} style={styles.optionIcon}><LockIcon /></LinearGradient></View>
          <View style={styles.optionContent}><Text style={styles.optionTitle}>Private</Text><Text style={styles.optionDescription}>Only invited members can join</Text></View>
          <View style={[styles.radioButton, formData.status === 'private' && styles.radioButtonSelected]} />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Join Fee</Text>
      <View style={styles.optionSection}>
        <TouchableOpacity 
          style={[styles.optionCard, formData.joinFee === 'free' && styles.optionCardSelected]} 
          onPress={() => updateFormData('joinFee', 'free')}
          activeOpacity={1}
        >
          <View style={styles.optionIconContainer}><LinearGradient colors={['#10B981', '#059669']} style={styles.optionIcon}><UsersIcon /></LinearGradient></View>
          <View style={styles.optionContent}><Text style={styles.optionTitle}>Free</Text><Text style={styles.optionDescription}>No cost to join your community</Text></View>
          <View style={[styles.radioButton, formData.joinFee === 'free' && styles.radioButtonSelected]} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.optionCard, formData.joinFee === 'paid' && styles.optionCardSelected]} 
          onPress={() => updateFormData('joinFee', 'paid')}
          activeOpacity={1}
        >
          <View style={styles.optionIconContainer}><LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.optionIcon}><DollarIcon /></LinearGradient></View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Paid</Text>
            <Text style={styles.optionDescription}>Set a membership fee</Text>
            {formData.joinFee === 'paid' && (
              <View style={styles.membershipFeeContainer}>
                <TouchableOpacity 
                  style={styles.currencySelector} 
                  onPress={() => setShowCurrencyModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.currencyText}>{selectedCurrency}</Text>
                  <ChevronDownIcon />
                </TouchableOpacity>
                <TextInput style={styles.feeInput} value={formData.feeAmount} onChangeText={text => updateFormData('feeAmount', text)} placeholder="0" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
              </View>
            )}
          </View>
          <View style={[styles.radioButton, formData.joinFee === 'paid' && styles.radioButtonSelected]} />
        </TouchableOpacity>
      </View>
    </View>

    {/* Currency Selection Modal */}
    <Modal visible={showCurrencyModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <TouchableOpacity onPress={() => setShowCurrencyModal(false)} activeOpacity={0.7}>
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={currencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyOption,
                  selectedCurrency === item.code && styles.currencyOptionSelected
                ]}
                onPress={() => {
                  setSelectedCurrency(item.code);
                  setShowCurrencyModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
                <View style={styles.currencyInfo}>
                  <Text style={styles.currencyCode}>{item.code}</Text>
                  <Text style={styles.currencyName}>{item.name}</Text>
                </View>
                {selectedCurrency === item.code && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  </>
);

export default StepTwo;