import AdaptiveBackground from '@/_components/AdaptiveBackground';
import AdaptiveStatusBar from '@/_components/AdaptiveStatusBar';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SuccessProps {
  communityName?: string;
  communityImage?: string | null;
  onGoToCommunities: () => void;
}

const Success = ({ communityName = "Your Community", communityImage, onGoToCommunities }: SuccessProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animation simple
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    onGoToCommunities();
  };

  return (
    <AdaptiveBackground style={{ flex: 1 }} resizeMode="cover">
      <AdaptiveStatusBar />
      {/* Main Content - Directement sur le background */}
      <Animated.View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 40,
          paddingTop: 60,
          paddingBottom: 60,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
          {/* Community Image */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
              backgroundColor: '#f0f0f0',
              overflow: 'hidden',
            }}
          >
            {communityImage ? (
              <Image
                source={{ uri: communityImage }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('@/assets/images/logo_chabaqa.png')}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }}
                resizeMode="cover"
              />
            )}
            {/* Small success checkmark overlay */}
            <View
              style={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                width: 35,
                height: 35,
                backgroundColor: '#8e78fb',
                borderRadius: 17.5,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#ffffff',
              }}
            >
              <Ionicons name="checkmark" size={20} color="#ffffff" />
            </View>
          </View>

          {/* Success Title */}
          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#333333',
              textAlign: 'center',
              marginBottom: 30,
            }}
          >
            {communityName} is live!
          </Text>

          {/* Success Message */}
          <Text
            style={{
              fontSize: 16,
              color: '#666666',
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: 50,
              paddingHorizontal: 20,
            }}
          >
            Your community "{communityName}" was created successfully.
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#8e78fb',
              paddingHorizontal: 50,
              paddingVertical: 18,
              borderRadius: 30,
              width: '90%',
              shadowColor: '#8e78fb',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </AdaptiveBackground>
    );
  };

export default Success;
