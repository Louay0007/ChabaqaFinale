import { ThemedText } from '@/_components/ThemedText';
import { Event } from '@/lib/mock-data';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
  event: Event;
  selectedTicket: string;
  setSelectedTicket: (ticket: string) => void;
  quantity: number;
  setQuantity: (quantity: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  setSelectedEvent: (event: Event | null) => void;
  handleRegister: () => void;
}

export default function EventCard({
  event,
  selectedTicket,
  setSelectedTicket,
  quantity,
  setQuantity,
  notes,
  setNotes,
  setSelectedEvent,
  handleRegister
}: EventCardProps) {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const minPrice = Math.min(...event.tickets.map((t) => t.price));

  const handleRegisterPress = () => {
    console.log('Opening registration modal');
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleConfirmRegistration = () => {
    console.log('Registration confirmed');
    handleRegister();
    setShowRegistrationModal(false);
  };

  const selectedTicketData = event.tickets.find(t => t.id === selectedTicket);
  const totalAmount = selectedTicketData ? selectedTicketData.price * quantity : 0;

  return (
    <View style={styles.card}>
      <Image source={{ uri: event.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{event.title}</ThemedText>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{event.type}</Text>
            </View>
          </View>
          <ThemedText style={styles.description} numberOfLines={2}>
            {event.description}
          </ThemedText>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📅</Text>
            <ThemedText style={styles.detailText}>
              {formatDate(event.startDate)} {event.startTime} - {event.endTime}
            </ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📍</Text>
            <ThemedText style={styles.detailText} numberOfLines={1}>
              {event.location}
            </ThemedText>
          </View>
        </View>

        <View style={styles.creatorSection}>
          <Image 
            source={{ uri: event.creator.avatar || 'https://via.placeholder.com/32' }} 
            style={styles.creatorAvatar}
          />
          <ThemedText style={styles.creatorName} numberOfLines={1}>
            {event.creator.name}
          </ThemedText>
        </View>


        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.priceLabel}>From</ThemedText>
            <ThemedText style={styles.price}>${minPrice}</ThemedText>
          </View>
          
          <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
            <Text style={styles.registerButtonIcon}>🎫</Text>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRegistrationModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                console.log('Close registration modal button pressed');
                setShowRegistrationModal(false);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>Register for {event.title}</ThemedText>
            <ThemedText style={styles.modalDescription}>{event.description}</ThemedText>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalBody}>
              <View style={styles.ticketSection}>
                <ThemedText style={styles.sectionTitle}>Select Ticket</ThemedText>
                {event.tickets.map((ticket) => (
                  <TouchableOpacity
                    key={ticket.id}
                    style={[
                      styles.ticketOption,
                      selectedTicket === ticket.id && styles.selectedTicketOption
                    ]}
                    onPress={() => setSelectedTicket(ticket.id)}
                  >
                    <View style={styles.ticketInfo}>
                      <ThemedText style={styles.ticketName}>{ticket.name}</ThemedText>
                      <ThemedText style={styles.ticketDescription}>{ticket.description}</ThemedText>
                    </View>
                    <ThemedText style={styles.ticketPrice}>${ticket.price}</ThemedText>
                  </TouchableOpacity>
                ))}

                <View style={styles.quantitySection}>
                  <ThemedText style={styles.sectionTitle}>Quantity</ThemedText>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => setQuantity(quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.notesSection}>
                  <ThemedText style={styles.sectionTitle}>Notes (Optional)</ThemedText>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Any special requests or info?"
                    placeholderTextColor="#9ca3af"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {selectedTicket && (
                  <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                      <ThemedText style={styles.summaryLabel}>Ticket:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{selectedTicketData?.name}</ThemedText>
                    </View>
                    <View style={styles.summaryRow}>
                      <ThemedText style={styles.summaryLabel}>Quantity:</ThemedText>
                      <ThemedText style={styles.summaryValue}>{quantity}</ThemedText>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                      <ThemedText style={styles.summaryTotal}>Total:</ThemedText>
                      <ThemedText style={styles.summaryTotal}>${totalAmount}</ThemedText>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRegistrationModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedTicket && styles.disabledButton
              ]}
              onPress={handleConfirmRegistration}
              disabled={!selectedTicket}
            >
              <Text style={styles.confirmButtonText}>Confirm Registration</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
    color: '#111827',
  },
  badge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  badgeText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    fontWeight: '400',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  creatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  creatorName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  speakers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  speakerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moreSpeakers: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  moreSpeakersText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  priceContainer: {
    alignItems: 'flex-start',
  },
  priceLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#9333ea',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  registerButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  registerButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // Fond blanc fixe
  },
  modalHeader: {
    paddingTop: 60, // Espace pour la status bar
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1000,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    paddingRight: 40, // Espace pour le bouton de fermeture
  },
  modalDescription: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalBody: {
    padding: 20,
  },
  ticketSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  ticketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  selectedTicketOption: {
    borderColor: '#9333ea',
    backgroundColor: '#f3e8ff',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  ticketDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  quantitySection: {
    marginTop: 16,
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  quantityButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
    color: '#111827',
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  summary: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 0,
  },
  summaryTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40, // Espace pour la navigation
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  confirmButton: {
    flex: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#9333ea',
    alignItems: 'center',
    shadowColor: '#9333ea',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
