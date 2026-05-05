import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SduiComponentProps } from '@/modules/sdui/types/sdui.types';
import { styles } from './styles';
import { theme } from '@/shared/constants';
import { moderateScale, verticalScale } from '@/shared/utils/scale';

interface Provider {
  id: string;
  name?: string;
  businessName?: string;
  title?: string;
  fullName?: string;
  displayName?: string;
  rating?: number;
  averageRating?: number;
  reviewCount?: number;
  imageUrl?: string;
  profileImageUrl?: string;
  photoUrl?: string;
  location?: string;
  city?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
  distance?: number;
  distanceKm?: number;
  services?: Array<{
    name: string;
    priceBase?: number;
    priceType?: string;
  }>;
  primaryService?: string;
  serviceCategory?: string;
}

interface ProviderGridConfig {
  columns?: number;
  title?: string;
  showRating?: boolean;
  showLocation?: boolean;
}

export default function ProviderGrid({ data, config, onItemPress }: SduiComponentProps) {
  const providers: Provider[] = data || [];
  const gridConfig: ProviderGridConfig = config || {};
  const numColumns = gridConfig.columns || 2;

  // Debug log (opcional - remova em produção)
  // if (__DEV__ && providers.length > 0) {
  //   console.log('[ProviderGrid] === DADOS RECEBIDOS ===');
  //   console.log('[ProviderGrid] Count:', providers.length);
  //   console.log('[ProviderGrid] Primeiro item:', JSON.stringify(providers[0], null, 2));
  // }

  // Função para calcular distância (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Pega localização do usuário (se disponível)
  const userLat = 0; // TODO: Pegar do GPS ou store
  const userLon = 0; // TODO: Pegar do GPS ou store

  const renderProvider = ({ item }: { item: Provider }) => {
    // Mapeia campos da API para o formato esperado
    const displayName = 
      item.name || 
      item.businessName ||
      item.title || 
      item.fullName || 
      item.displayName ||
      'Profissional';

    const rating = item.rating || item.averageRating;
    const reviewCount = item.reviewCount || 0;
    
    // Monta localização a partir de city/state se não vier location direto
    const location = 
      item.location || 
      (item.city && item.state ? `${item.city}, ${item.state}` : item.city) || 
      null;

    // Calcula distância se tiver coordenadas
    let distanceValue = item.distance || item.distanceKm;
    
    // Se não tiver distância pronta mas tiver coordenadas, calcula
    if (!distanceValue && item.latitude && item.longitude && userLat !== 0 && userLon !== 0) {
      const providerLat = parseFloat(item.latitude);
      const providerLon = parseFloat(item.longitude);
      if (!isNaN(providerLat) && !isNaN(providerLon)) {
        distanceValue = calculateDistance(userLat, userLon, providerLat, providerLon);
      }
    }
    
    const distanceText = distanceValue 
      ? `${distanceValue.toFixed(1)} km`
      : (item.latitude && item.longitude ? 'Próximo' : null);

    // Pega o serviço principal
    const primaryService = 
      item.primaryService ||
      item.serviceCategory ||
      (item.services && item.services.length > 0 ? item.services[0].name : null);

    // Tenta encontrar foto em vários campos
    const imageUrl = item.imageUrl || item.profileImageUrl || item.photoUrl;

    return (
      <TouchableOpacity
        style={[styles.providerCard, { flex: 1 / numColumns }]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.7}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.providerImage} />
        ) : (
          <View style={styles.providerImagePlaceholder}>
            <Ionicons name="person-circle-outline" size={40} color={theme.colors.primary.light} />
          </View>
        )}
        
        <View style={styles.providerContent}>
          <Text style={styles.providerName} numberOfLines={2}>
            {displayName}
          </Text>
          
          {primaryService && (
            <View style={styles.providerService}>
              <Ionicons name="briefcase-outline" size={12} color={theme.colors.text.secondary} />
              <Text style={styles.providerServiceText} numberOfLines={1}>
                {primaryService}
              </Text>
            </View>
          )}
          
          {gridConfig.showRating !== false && rating && (
            <View style={styles.providerRating}>
              <Ionicons name="star" size={14} color={theme.colors.accent.yellow} />
              <Text style={styles.providerRatingText}>
                {typeof rating === 'number' ? rating.toFixed(1) : rating} ({reviewCount})
              </Text>
            </View>
          )}
          
          <View style={styles.providerMeta}>
            {distanceText && (
              <View style={styles.providerMetaItem}>
                <Ionicons name="navigate-outline" size={12} color={theme.colors.text.secondary} />
                <Text style={styles.providerMetaText} numberOfLines={1}>
                  {distanceText}
                </Text>
              </View>
            )}
            
            {location && (
              <View style={styles.providerMetaItem}>
                <Ionicons name="location-outline" size={12} color={theme.colors.text.secondary} />
                <Text style={styles.providerMetaText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (providers.length === 0) {
    return (
      <View style={styles.sectionContainer}>
        {gridConfig.title && (
          <Text style={styles.sectionTitle}>{gridConfig.title}</Text>
        )}
        <View style={styles.providerImagePlaceholder}>
          <Ionicons name="people-outline" size={64} color={theme.colors.text.secondary} />
          <Text style={styles.providerName}>Nenhum profissional disponível</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      {gridConfig.title && (
        <Text style={styles.sectionTitle}>{gridConfig.title}</Text>
      )}
      
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.providerGridContent}
        columnWrapperStyle={styles.providerGridRow}
        scrollEnabled={false}
      />
    </View>
  );
}
