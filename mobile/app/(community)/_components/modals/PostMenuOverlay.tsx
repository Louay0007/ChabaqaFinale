import { colors } from '@/lib/design-tokens';
import { AlertTriangle, EyeOff, Save } from 'lucide-react-native';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { modalStyles } from './modal-styles';

interface PostMenuOverlayProps {
  onSavePost: () => void;
  onHidePost: () => void;
  onReportPost: () => void;
  onClose: () => void;
}

export default function PostMenuOverlay({
  onSavePost,
  onHidePost,
  onReportPost,
  onClose
}: PostMenuOverlayProps) {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={modalStyles.postMenuOverlay}>
        <TouchableWithoutFeedback>
          <View style={modalStyles.menuContainer}>
            <TouchableOpacity 
              style={modalStyles.menuItem} 
              onPress={onSavePost}
              activeOpacity={0.7}
            >
              <Save size={20} color={colors.gray600} />
              <Text style={modalStyles.menuItemText}>Save post</Text>
            </TouchableOpacity>
            
            <View style={modalStyles.menuDivider} />
            
            <TouchableOpacity 
              style={modalStyles.menuItem} 
              onPress={onHidePost}
              activeOpacity={0.7}
            >
              <EyeOff size={20} color={colors.gray600} />
              <Text style={modalStyles.menuItemText}>Hide post</Text>
            </TouchableOpacity>
            
            <View style={modalStyles.menuDivider} />
            
            <TouchableOpacity 
              style={modalStyles.menuItem} 
              onPress={onReportPost}
              activeOpacity={0.7}
            >
              <AlertTriangle size={20} color={colors.error} />
              <Text style={[modalStyles.menuItemText, modalStyles.errorText]}>Report post</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
