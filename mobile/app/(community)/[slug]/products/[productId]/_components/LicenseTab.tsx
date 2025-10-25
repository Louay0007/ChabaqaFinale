import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../../styles';

interface LicenseTabProps {
  product: {
    license?: string;
    terms?: string;
    usage?: string;
  };
}

export const LicenseTab: React.FC<LicenseTabProps> = ({ product }) => {
  const { license, terms, usage } = product;

  const defaultLicenseText = `
LICENCE D'UTILISATION

1. DROITS ACCORDÉS
Cette licence vous accorde le droit d'utiliser ce produit à des fins personnelles et commerciales dans le cadre des conditions énoncées ci-dessous.

2. RESTRICTIONS
- Vous ne pouvez pas revendre, redistribuer ou partager ce produit avec des tiers
- Vous ne pouvez pas prétendre être l'auteur original de ce produit
- L'utilisation doit respecter les lois en vigueur

3. PROPRIÉTÉ INTELLECTUELLE
Tous les droits de propriété intellectuelle demeurent la propriété exclusive de l'auteur original.

4. RESPONSABILITÉ
Le produit est fourni "tel quel" sans garantie d'aucune sorte.

5. RÉSILIATION
Cette licence peut être résiliée en cas de violation des conditions d'utilisation.
  `.trim();

  return (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Licence et conditions d'utilisation</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.licenseText}>
            {license || terms || usage || defaultLicenseText}
          </Text>
        </ScrollView>
        
        <View style={{ marginTop: 16, padding: 12, backgroundColor: '#fef3c7', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#d97706', fontWeight: '500' }}>
            ⚠️ Important: En téléchargeant ou en utilisant ce produit, vous acceptez les termes de cette licence.
          </Text>
        </View>
      </View>
    </View>
  );
};
