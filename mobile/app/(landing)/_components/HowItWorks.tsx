import BackButton from '@/_components/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../_styles';

interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  visible: boolean;
  onClose: () => void;
  steps: HowItWorksStep[];
  onStartBuilding: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ 
  visible, 
  onClose, 
  steps, 
  onStartBuilding 
}) => {
  // Variables d'animation pour le contrôle de la flèche par scroll
  const arrowOpacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

  // Fonction pour gérer le scroll et contrôler l'affichage de la flèche
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    
    if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
      // Scroll vers le bas - masquer la flèche
      Animated.timing(arrowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (currentScrollY <= 50 || currentScrollY < lastScrollY.current) {
      // Scroll vers le haut ou proche du haut - afficher la flèche
      Animated.timing(arrowOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    
    lastScrollY.current = currentScrollY;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'white',
        paddingTop: 50
      }}>
        {/* Flèche avec animation de scroll */}
        <BackButton
          onPress={onClose}
          animated={true}
          opacity={arrowOpacity}
          style={{
            position: 'absolute',
            top: 60,
            left: 20,
            zIndex: 100,
          }}
        />
        
        <ScrollView 
          style={styles.howItWorksSection}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>
            Get started with Chabaqa in just four simple steps and watch your community flourish.
          </Text>
          
          {/* Design avec votre palette de couleurs */}
          <View style={{
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}>
            {steps.map((step, index) => {
              const colorPalette = [
                '#ff9b28', // Orange
                '#8e78fb', // Violet
                '#47c7ea', // Cyan
                '#f65887'  // Rose
              ];
              
              const stepColor = colorPalette[index] || '#ff9b28';
              const isEven = index % 2 === 0;
              
              return (
                <View 
                  key={index} 
                  style={{
                    marginBottom: 25,
                    alignItems: isEven ? 'flex-start' : 'flex-end',
                  }}
                >
                  {/* Carte avec couleur de votre palette */}
                  <View
                    style={{
                      width: '85%',
                      borderRadius: 16,
                      padding: 20,
                      backgroundColor: '#f8fafc',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                      elevation: 2,
                      borderLeftWidth: 3,
                      borderLeftColor: stepColor,
                      borderTopWidth: 0.5,
                      borderRightWidth: 0.5,
                      borderBottomWidth: 0.5,
                      borderTopColor: '#e2e8f0',
                      borderRightColor: '#e2e8f0',
                      borderBottomColor: '#e2e8f0',
                    }}
                  >
                    {/* Numéro avec couleur de votre palette */}
                    <View style={{
                      position: 'absolute',
                      top: -12,
                      [isEven ? 'left' : 'right']: 20,
                      backgroundColor: stepColor,
                      borderRadius: 20,
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#ffffff',
                      }}>
                        {step.step}
                      </Text>
                    </View>

                    {/* Contenu */}
                    <View style={{ marginTop: 15 }}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: 8,
                      }}>
                        {step.title}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: '#6b7280',
                        lineHeight: 20,
                      }}>
                        {step.description}
                      </Text>
                    </View>

                    {/* Point décoratif avec couleur de votre palette */}
                    <View style={{
                      position: 'absolute',
                      bottom: 15,
                      right: 15,
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: stepColor,
                      opacity: 0.6,
                    }} />
                  </View>

                  {/* Ligne avec couleur de votre palette */}
                  {index < steps.length - 1 && (
                    <View style={{
                      width: 2,
                      height: 25,
                      backgroundColor: stepColor,
                      marginTop: 12,
                      marginLeft: isEven ? '65%' : '20%',
                      borderRadius: 1,
                      opacity: 0.4,
                    }} />
                  )}
                </View>
              );
            })}
          </View>
          
          <TouchableOpacity
            onPress={onStartBuilding}
            activeOpacity={0.8}
            style={{marginTop: 20, marginBottom: 40}}
          >
            <LinearGradient
              colors={['#8e78fb', '#47c7ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>Start Building Your Community</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default HowItWorks;
