import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n/i18n';

const LanguageSelector = () => {
  const { locale, changeLocale, availableLocales } = useI18n();
  const [modalVisible, setModalVisible] = useState(false);

  const languages = {
    en: { name: 'English', flag: '🇺🇸' },
    zh: { name: '中文', flag: '🇨🇳' },
    zhTW: { name: '繁體中文', flag: '🇹🇼' },
  };

  const handleLanguageSelect = (langCode) => {
    changeLocale(langCode);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="language" size={20} color="#fff" />
        <Text style={styles.selectorText}>{languages[locale]?.flag || '🌐'}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={styles.languageList}>
              {availableLocales.map((langCode) => (
                <TouchableOpacity
                  key={langCode}
                  style={[
                    styles.languageItem,
                    locale === langCode && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(langCode)}
                >
                  <Text style={styles.flag}>{languages[langCode]?.flag || '🌐'}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      locale === langCode && styles.languageNameSelected,
                    ]}
                  >
                    {languages[langCode]?.name || langCode}
                  </Text>
                  {locale === langCode && (
                    <Ionicons name="checkmark" size={20} color="#007bff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 0,
    height: 32,
    width: 100,
  },
  selectorText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 0,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    padding: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  languageItemSelected: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  languageNameSelected: {
    color: '#007bff',
    fontWeight: '600',
  },
});

export default LanguageSelector;

