import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/use-auth';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { updateProfile, UpdateProfileData, validateEmail, validateName, validatePhone } from '@/lib/user-api';
import { getProfileData } from '@/lib/profile-api';

// Countries list
const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
].sort();

export default function EditProfileScreen() {
  const { user, refetch: refreshUser } = useAuth();
  const adaptiveColors = useAdaptiveColors();
  
  // Form state - Only essential fields
  const [formData, setFormData] = useState<UpdateProfileData>({
    name: '',
    bio: '',
    numtel: '',
    pays: '',
    ville: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // Load current profile data
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      console.log('🔄 [EDIT-PROFILE] Loading current profile data...');
      
      const profileData = await getProfileData();
      const userData = profileData.user || user;
      
      if (userData) {
        const formValues = {
          name: userData.name || '',
          bio: userData.bio || '',
          numtel: userData.numtel || '',
          pays: userData.pays || '',
          ville: userData.ville || '',
        };
        
        console.log('✅ [EDIT-PROFILE] Loaded current profile data:', {
          name: formValues.name || 'Empty',
          bio: formValues.bio ? 'Has bio' : 'Empty',
          phone: formValues.numtel || 'Empty',
          country: formValues.pays || 'Empty',
          city: formValues.ville || 'Empty'
        });
        
        setFormData(formValues);
        setAvatarUri(userData.avatar || null);
      } else {
        console.warn('⚠️ [EDIT-PROFILE] No user data available');
      }
    } catch (error) {
      console.error('💥 [EDIT-PROFILE] Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (formData.name && !validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Phone validation
    if (formData.numtel && !validatePhone(formData.numtel)) {
      newErrors.numtel = 'Please enter a valid phone number';
    }

    // Email validation (if we add email editing)
    // if (formData.email && !validateEmail(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle avatar selection
  const handleAvatarPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setHasChanges(true);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Filter out empty values and validate data
      const updateData: UpdateProfileData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) {
          updateData[key as keyof UpdateProfileData] = value.trim();
        }
      });
      
      // Ensure we have at least some data to update
      if (Object.keys(updateData).length === 0) {
        Alert.alert('No Changes', 'Please make some changes before saving.');
        return;
      }

      console.log('🔄 [EDIT-PROFILE] Updating profile with data:', {
        fieldsToUpdate: Object.keys(updateData),
        data: updateData
      });
      
      const result = await updateProfile(updateData);
      console.log('✅ [EDIT-PROFILE] Profile updated successfully:', result);
      
      // Refresh user data in auth context
      await refreshUser();
      console.log('✅ [EDIT-PROFILE] User data refreshed in auth context');
      
      // Also reload the current profile data to ensure it's fresh
      await loadProfileData();
      console.log('✅ [EDIT-PROFILE] Profile data reloaded with fresh data');
      
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ 
          text: 'OK', 
          onPress: () => {
            setHasChanges(false);
            router.back();
          }
        }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    handleFieldChange('pays', country);
    setShowCountryPicker(false);
    setCountrySearchQuery('');
  };

  // Filter countries based on search query
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  // Handle back navigation with unsaved changes warning
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: adaptiveColors.cardBackground }}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: adaptiveColors.cardBackground }} edges={[]}>
      <StatusBar style={adaptiveColors.isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Platform.OS === 'ios' ? 44 + 12 : 12,
        backgroundColor: adaptiveColors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: adaptiveColors.cardBorder,
      }}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color={adaptiveColors.primaryText} />
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: adaptiveColors.primaryText,
        }}>
          Edit Profile
        </Text>
        
        <TouchableOpacity 
          onPress={handleSave}
          disabled={saving || !hasChanges}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: hasChanges ? '#8e78fb' : adaptiveColors.cardBorder,
          }}
        >
          <Text style={{
            color: hasChanges ? '#fff' : adaptiveColors.secondaryText,
            fontWeight: '600',
            fontSize: 14,
          }}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Avatar Section */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 32,
            backgroundColor: adaptiveColors.cardBackground,
          }}>
            <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                borderWidth: 4,
                borderColor: '#8e78fb',
              }}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <LinearGradient
                    colors={['#8e78fb', '#667eea']}
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Ionicons name="person" size={48} color="#fff" />
                  </LinearGradient>
                )}
                
                {/* Camera overlay */}
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#ff9b28',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 3,
                  borderColor: '#fff',
                }}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
            
            <Text style={{
              marginTop: 12,
              fontSize: 14,
              color: adaptiveColors.secondaryText,
            }}>
              Tap to change photo
            </Text>
          </View>

          {/* Form Fields */}
          <View style={{ padding: 16, gap: 20 }}>
            
            {/* Basic Information */}
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: adaptiveColors.primaryText,
                marginBottom: 16,
              }}>
                Basic Information
              </Text>
              
              {/* Name */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: adaptiveColors.primaryText,
                  marginBottom: 8,
                }}>
                  Full Name *
                </Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(value) => handleFieldChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={adaptiveColors.secondaryText}
                  style={{
                    backgroundColor: adaptiveColors.cardBackground,
                    borderWidth: 1,
                    borderColor: errors.name ? '#ef4444' : adaptiveColors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: adaptiveColors.primaryText,
                  }}
                />
                {errors.name && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Bio */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: adaptiveColors.primaryText,
                  marginBottom: 8,
                }}>
                  Bio
                </Text>
                <TextInput
                  value={formData.bio}
                  onChangeText={(value) => handleFieldChange('bio', value)}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={adaptiveColors.secondaryText}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  style={{
                    backgroundColor: adaptiveColors.cardBackground,
                    borderWidth: 1,
                    borderColor: adaptiveColors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: adaptiveColors.primaryText,
                    minHeight: 80,
                  }}
                />
              </View>
            </View>

            {/* Contact Information */}
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: adaptiveColors.primaryText,
                marginBottom: 16,
              }}>
                Contact Information
              </Text>
              
              {/* Phone */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: adaptiveColors.primaryText,
                  marginBottom: 8,
                }}>
                  Phone Number
                </Text>
                <TextInput
                  value={formData.numtel}
                  onChangeText={(value) => handleFieldChange('numtel', value)}
                  placeholder="+216 12 345 678"
                  placeholderTextColor={adaptiveColors.secondaryText}
                  keyboardType="phone-pad"
                  style={{
                    backgroundColor: adaptiveColors.cardBackground,
                    borderWidth: 1,
                    borderColor: errors.numtel ? '#ef4444' : adaptiveColors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: adaptiveColors.primaryText,
                  }}
                />
                {errors.numtel && (
                  <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    {errors.numtel}
                  </Text>
                )}
              </View>
            </View>

            {/* Location Information */}
            <View>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: adaptiveColors.primaryText,
                marginBottom: 16,
              }}>
                Location
              </Text>
              
              {/* Country */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: adaptiveColors.primaryText,
                  marginBottom: 8,
                }}>
                  Country
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={{
                    backgroundColor: adaptiveColors.cardBackground,
                    borderWidth: 1,
                    borderColor: adaptiveColors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: formData.pays ? adaptiveColors.primaryText : adaptiveColors.secondaryText,
                  }}>
                    {formData.pays || 'Select Country'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={adaptiveColors.secondaryText} />
                </TouchableOpacity>
              </View>

              {/* City */}
              <View style={{ marginBottom: 32 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: adaptiveColors.primaryText,
                  marginBottom: 8,
                }}>
                  City
                </Text>
                <TextInput
                  value={formData.ville}
                  onChangeText={(value) => handleFieldChange('ville', value)}
                  placeholder="Tunis"
                  placeholderTextColor={adaptiveColors.secondaryText}
                  style={{
                    backgroundColor: adaptiveColors.cardBackground,
                    borderWidth: 1,
                    borderColor: adaptiveColors.cardBorder,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 16,
                    color: adaptiveColors.primaryText,
                  }}
                />
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: adaptiveColors.cardBackground }}>
          {/* Modal Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: adaptiveColors.cardBorder,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: adaptiveColors.primaryText,
            }}>
              Select Country
            </Text>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <Ionicons name="close" size={24} color={adaptiveColors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: adaptiveColors.cardBorder,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: adaptiveColors.inputBackground || adaptiveColors.cardBackground,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: adaptiveColors.cardBorder,
            }}>
              <Ionicons name="search" size={20} color={adaptiveColors.secondaryText} style={{ marginRight: 8 }} />
              <TextInput
                value={countrySearchQuery}
                onChangeText={setCountrySearchQuery}
                placeholder="Search countries..."
                placeholderTextColor={adaptiveColors.secondaryText}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: adaptiveColors.primaryText,
                  paddingVertical: 4,
                }}
              />
            </View>
          </View>

          {/* Countries List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCountrySelect(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: adaptiveColors.cardBorder,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: adaptiveColors.primaryText,
                }}>
                  {item}
                </Text>
                {formData.pays === item && (
                  <Ionicons name="checkmark" size={20} color="#8e78fb" />
                )}
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
