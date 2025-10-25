import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import UsersIcon from './icons/UsersIcon';
import DollarIcon from './icons/DollarIcon';
import ChartIcon from './icons/ChartIcon';
import styles from '../_styles';

interface Stat {
  value: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <LinearGradient
            colors={
              index === 0 ? ['#8e78fb', '#b78cfa'] :
              index === 1 ? ['#47c7ea', '#67e2e2'] :
                           ['#e46ace', '#f090cb']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statIconContainer}
          >
            {index === 0 ? <UsersIcon /> :
             index === 1 ? <DollarIcon /> :
                          <ChartIcon />}
          </LinearGradient>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default Stats;
