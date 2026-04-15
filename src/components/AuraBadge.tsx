import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { Lightning as Zap } from 'phosphor-react-native';

interface AuraBadgeProps {
  score: number;
  showIcon?: boolean;
}

export const AuraBadge: React.FC<AuraBadgeProps> = ({ score, showIcon = true }) => {
  const formattedScore = score >= 1000 ? `${(score / 1000).toFixed(1)}k` : score;

  return (
    <View style={styles.container}>
      {showIcon && <Zap size={14} color={theme.colors.accent} weight="fill" />}
      <Text style={styles.text}>{formattedScore} Aura</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 208, 156, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.2)',
  },
  text: {
    color: theme.colors.accent,
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
    marginLeft: 4,
  },
});
