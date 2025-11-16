import { Card } from '@/_components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { communityStyles } from '../_styles';

interface CommunityCardProps {
  community: {
    id: string;
    slug: string;
    name: string;
    creator: string;
    creatorAvatar?: string;
    description: string;
    category: string;
    members: number;
    rating: number;
    price: number;
    priceType: string;
    image: number; // Images locales uniquement
    tags: string[];
    featured: boolean;
    verified: boolean;
    type?: "community" | "course" | "challenge" | "product" | "oneToOne";
  };
  viewMode?: 'list' | 'grid';
}

export default function CommunityCard({ community, viewMode = 'list' }: CommunityCardProps) {
  const handlePress = () => {
    router.push(`/(communities)/${community.slug}`);
  };

  const formatMembers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const formatPrice = (price: number, type: string) => {
    if (type === "free" || price === 0) return "Free";
    return `$${price}/${type === "monthly" ? "mo" : type}`;
  };

  // Get type-specific styling and CTA text (same as web version)
  const getTypeConfig = (type?: string) => {
    const itemType = type || "community";
    
    const typeConfigs = {
      community: {
        badgeColor: "#8e78fb",
        backgroundColor: "#8e78fb10",
        borderColor: "#8e78fb50",
        ctaText: "Join",
        gradientColors: ["#8e78fb", "#8e78fb"],
      },
      course: {
        badgeColor: "#3b82f6", 
        backgroundColor: "#3b82f610",
        borderColor: "#3b82f650",
        ctaText: "Join",
        gradientColors: ["#3b82f6", "#3b82f6"],
      },
      challenge: {
        badgeColor: "#f97316",
        backgroundColor: "#f9731610", 
        borderColor: "#f9731650",
        ctaText: "Join",
        gradientColors: ["#f97316", "#f97316"],
      },
      product: {
        badgeColor: "#6366f1",
        backgroundColor: "#6366f110",
        borderColor: "#6366f150", 
        ctaText: "Buy",
        gradientColors: ["#6366f1", "#6366f1"],
      },
      oneToOne: {
        badgeColor: "#F7567C",
        backgroundColor: "#F7567C10",
        borderColor: "#F7567C50",
        ctaText: "Book", 
        gradientColors: ["#F7567C", "#F7567C"],
      },
      event: {
        badgeColor: "#9333ea",
        backgroundColor: "#9333ea10",
        borderColor: "#9333ea50",
        ctaText: "Join",
        gradientColors: ["#9333ea", "#9333ea"],
      },
    };

    return typeConfigs[itemType as keyof typeof typeConfigs] || typeConfigs.community;
  };

  const typeConfig = getTypeConfig(community.type);

  if (viewMode === "list") {
    return (
      <Card style={communityStyles.listCard}>
        <TouchableOpacity 
          onPress={handlePress} 
          style={communityStyles.cardTouchable}
          activeOpacity={0.95}
        >
          <View style={communityStyles.listContainer}>
            {/* Image Section */}
            <View style={communityStyles.listImageContainer}>
              <Image 
                source={community.image} 
                style={communityStyles.listImage}
                resizeMode="cover"
                onError={(error) => {
                  console.log('Image loading error:', error.nativeEvent.error);
                }}
              />
              
              {/* Overlay Gradient */}
              <View style={communityStyles.imageOverlay} />

              {/* Price Badge */}
              <View style={communityStyles.priceBadgeContainer}>
                <View style={[
                  communityStyles.priceBadge,
                  { backgroundColor: community.price === 0 ? '#10b981' : '#8e78fb' }
                ]}>
                  <Text style={communityStyles.priceBadgeText}>
                    {formatPrice(community.price, community.priceType)}
                  </Text>
                </View>
              </View>

              {/* Category Badge */}
              <View style={communityStyles.categoryBadgeContainer}>
                <View style={communityStyles.categoryBadge}>
                  <Text style={communityStyles.categoryBadgeText}>{community.category}</Text>
                </View>
              </View>
            </View>

            {/* Content Section */}
            <View style={communityStyles.listContent}>
              <View style={communityStyles.listContentTop}>
                {/* Title */}
                <View style={communityStyles.titleRow}>
                  <Text style={communityStyles.listTitle} numberOfLines={2}>
                    {community.name}
                  </Text>
                </View>

                {/* Creator */}
                <View style={communityStyles.creatorRow}>
                  <Image
                    source={{ uri: community.creatorAvatar }}
                    style={communityStyles.communityCardCreatorAvatar}
                  />
                  <Text style={communityStyles.creatorText}>
                    by <Text style={communityStyles.communityCardCreatorName}>{community.creator}</Text>
                  </Text>
                </View>

                {/* Description */}
                <Text style={communityStyles.listDescription} numberOfLines={2}>
                  {community.description}
                </Text>

                {/* Tags */}
                <View style={communityStyles.communityCardTagsContainer}>
                  {community.tags.slice(0, 4).map((tag, index) => (
                    <View key={index} style={communityStyles.communityCardTag}>
                      <Text style={communityStyles.communityCardTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Footer */}
              <View style={communityStyles.listFooter}>
                {/* Stats */}
                <View style={communityStyles.communityCardStatsContainer}>
                  <View style={communityStyles.communityCardStatItem}>
                    <Ionicons name="people" size={12} color="#8e78fb" />
                    <Text style={communityStyles.communityCardStatText}>{formatMembers(community.members)}</Text>
                  </View>
                  <View style={communityStyles.communityCardStatItem}>
                    <Ionicons name="star" size={12} color="#f59e0b" />
                    <Text style={communityStyles.communityCardStatText}>{community.rating}</Text>
                  </View>
                  <View style={[
                    communityStyles.typeBadge, 
                    { 
                      borderColor: typeConfig.borderColor,
                      backgroundColor: typeConfig.backgroundColor 
                    }
                  ]}>
                    <Text style={[communityStyles.typeBadgeText, { color: typeConfig.badgeColor }]}>
                      {community.type || 'community'}
                    </Text>
                  </View>
                </View>

                {/* CTA Button */}
                <TouchableOpacity 
                  style={[communityStyles.communityCardCtaButton, { backgroundColor: '#8e78fb' }]}
                  onPress={handlePress}
                >
                  <Text style={communityStyles.communityCardCtaButtonText}>{typeConfig.ctaText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    );
  }

  // Grid View (simplified version matching web design)
  return (
    <Card style={communityStyles.communityCardGridCard}>
      <TouchableOpacity 
        onPress={handlePress} 
        style={communityStyles.cardTouchable}
        activeOpacity={0.95}
      >
        {/* Image Section */}
        <View style={communityStyles.gridImageContainer}>
          <Image 
            source={community.image} 
            style={communityStyles.communityCardGridImage}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image loading error:', error.nativeEvent.error);
            }}
          />
          
          {/* Overlay */}
          <View style={communityStyles.gridImageOverlay} />

          {/* Price Badge */}
          <View style={communityStyles.gridPriceBadgeContainer}>
            <View style={[
              communityStyles.priceBadge,
              { backgroundColor: community.price === 0 ? '#10b981' : '#8e78fb' }
            ]}>
              <Text style={communityStyles.priceBadgeText}>
                {formatPrice(community.price, community.priceType)}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={communityStyles.communityCardGridContent}>
          <Text style={communityStyles.communityCardGridTitle} numberOfLines={2}>
            {community.name}
          </Text>

          {/* Creator */}
          <View style={communityStyles.gridCreatorRow}>
            <Image
              source={{ uri: community.creatorAvatar }}
              style={communityStyles.gridCreatorAvatar}
            />
            <Text style={communityStyles.gridCreatorText}>
              by <Text style={communityStyles.communityCardCreatorName}>{community.creator}</Text>
            </Text>
          </View>

          {/* Stats */}
          <View style={communityStyles.gridStatsContainer}>
            <View style={communityStyles.communityCardStatItem}>
              <Ionicons name="people" size={12} color="#8e78fb" />
              <Text style={communityStyles.communityCardStatText}>{formatMembers(community.members)}</Text>
            </View>
            <View style={communityStyles.communityCardStatItem}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={communityStyles.communityCardStatText}>{community.rating}</Text>
            </View>
            <View style={[
              communityStyles.typeBadge, 
              { 
                borderColor: typeConfig.borderColor,
                backgroundColor: typeConfig.backgroundColor 
              }
            ]}>
              <Text style={[communityStyles.typeBadgeText, { color: typeConfig.badgeColor }]}>
                {community.type || 'community'}
              </Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity 
            style={[communityStyles.communityCardGridCtaButton, { backgroundColor: '#8e78fb' }]}
            onPress={handlePress}
          >
            <Text style={communityStyles.communityCardCtaButtonText}>{typeConfig.ctaText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Card>
  );

}
