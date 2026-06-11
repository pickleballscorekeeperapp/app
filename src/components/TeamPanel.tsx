import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, space } from '@/theme';
import type { ServerNumber, TeamId } from '@/domain/scoring';

interface Props {
  team: TeamId;
  name: string;
  score: number;
  isServing: boolean;
  serverNumber: ServerNumber;
  servesFromRight: boolean;
  disabled: boolean;
  onWinRally: () => void;
}

/**
 * Giant tap target: tap the team that won the rally. The engine decides
 * whether that's a point, a second server, or a side-out.
 */
export function TeamPanel({
  team,
  name,
  score,
  isServing,
  serverNumber,
  servesFromRight,
  disabled,
  onWinRally,
}: Props) {
  const accent = team === 'A' ? colors.teamA : colors.teamB;
  const soft = team === 'A' ? colors.teamASoft : colors.teamBSoft;
  const pressedBg = team === 'A' ? colors.teamAPressed : colors.teamBPressed;

  return (
    <Pressable
      disabled={disabled}
      onPress={onWinRally}
      style={({ pressed }) => [
        styles.panel,
        { backgroundColor: soft, borderColor: isServing ? accent : colors.border },
        isServing && styles.panelServing,
        pressed && { backgroundColor: pressedBg },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${name} won the rally`}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.name, { color: accent }]} numberOfLines={1}>
        {name}
      </Text>

      <Text style={[styles.score, { color: accent }]}>{score}</Text>

      {isServing ? (
        <View style={styles.serveWrap}>
          <View style={[styles.serveBadge, { backgroundColor: accent }]}>
            <Text style={styles.serveBadgeText} numberOfLines={1}>
              SERVING #{serverNumber}
            </Text>
          </View>
          <Text style={[styles.courtText, { color: accent }]} numberOfLines={1}>
            {servesFromRight ? 'RIGHT' : 'LEFT'} COURT
          </Text>
        </View>
      ) : (
        <View style={styles.serveSpacer} />
      )}

      <Text style={[styles.tapHint, { color: accent }]} numberOfLines={1}>
        TAP IF WE WON
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    borderRadius: radius['2xl'],
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space['4'],
    paddingHorizontal: space['2'],
    gap: space['2'],
  },
  panelServing: { borderWidth: 4 },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  score: {
    fontSize: fontSize.score,
    fontWeight: fontWeight.black,
    lineHeight: fontSize.score + 4,
    fontVariant: ['tabular-nums'],
  },
  serveWrap: { alignItems: 'center', gap: 4 },
  serveBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: space['4'],
    paddingVertical: 6,
    maxWidth: '100%',
    alignItems: 'center',
  },
  serveBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.4,
  },
  courtText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.6,
  },
  serveSpacer: { height: 53 },
  tapHint: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
    opacity: 0.75,
    textAlign: 'center',
  },
});
