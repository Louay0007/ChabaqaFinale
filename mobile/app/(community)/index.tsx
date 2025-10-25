import { communities } from '@/lib/mock-data';
import { Link } from 'expo-router';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { communityStyles } from './_components/community-styles';

export default function CommunitiesList() {
  return (
    <View style={communityStyles.listContainer}>
      <Text style={communityStyles.pageTitle}>Explore Communities</Text>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/(community)/${item.slug}`} asChild>
            <TouchableOpacity style={communityStyles.communityCard}>
              <Image
                source={{ uri: item.image }}
                style={communityStyles.communityImage}
              />
              <View style={communityStyles.communityInfo}>
                <Text style={communityStyles.communityName}>{item.name}</Text>
                <Text style={communityStyles.communityDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={communityStyles.communityMeta}>
                  <Text style={communityStyles.memberCount}>{item.members.toLocaleString()} members</Text>
                  <Text style={communityStyles.communityCategory}>{item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}