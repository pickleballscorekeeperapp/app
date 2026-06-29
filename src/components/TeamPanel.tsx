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
  presentation?: 'portrait' | 'landscape';
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
  presentation = 'portrait',
  onWinRally,
}: Props) {
  const accent = team === 'A' ? colors.teamA : colors.teamB;
  const soft = team === 'A' ? colors.teamASoft : colors.teamBSoft;
  const pressedBg = team === 'A' ? colors.teamAPressed : colors.teamBPressed;
  const isLandscape = presentation === 'landscape';

  return (
    <Pressable
      disabled={disabled}
      onPress={onWinRally}
      style={({ pressed }) => [
        styles.panel,
        isLandscape && styles.panelLandscape,
        { backgroundColor: soft, borderColor: isServing ? accent : colors.border },
        isServing && styles.panelServing,
        isLandscape && isServing && styles.panelServingLandscape,
        pressed && { backgroundColor: pressedBg },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${name} won the rally`}
      accessibilityState={{ disabled }}
    >
      <Text
        style={[styles.name, isLandscape && styles.nameLandscape, { color: accent }]}
        numberOfLines={1}
      >
        {name}
      </Text>

      <Text style={[styles.score, isLandscape && styles.scoreLandscape, { color: accent }]}>
        {score}
      </Text>

      {isServing ? (
        <View style={[styles.serveWrap, isLandscape && styles.serveWrapLandscape]}>
          <View
            style={[
              styles.serveBadge,
              isLandscape && styles.serveBadgeLandscape,
              { backgroundColor: accent },
            ]}
          >
            <Text
              style={[styles.serveBadgeText, isLandscape && styles.serveBadgeTextLandscape]}
              numberOfLines={1}
            >
              SERVING #{serverNumber}
            </Text>
          </View>
          <Text
            style={[styles.courtText, isLandscape && styles.courtTextLandscape, { color: accent }]}
            numberOfLines={1}
          >
            {servesFromRight ? 'RIGHT' : 'LEFT'} COURT
          </Text>
        </View>
      ) : (
        <View style={isLandscape ? styles.serveSpacerLandscape : styles.serveSpacer} />
      )}

      {!isLandscape && (
        <Text style={[styles.tapHint, { color: accent }]} numberOfLines={1}>
          TAP IF WE WON
        </Text>
      )}
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
  panelLandscape: {
    borderRadius: radius.xl,
    paddingVertical: space['2'],
    paddingHorizontal: space['3'],
    gap: space['1'],
  },
  panelServing: { borderWidth: 4 },
  panelServingLandscape: { borderWidth: 5 },
  name: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  nameLandscape: {
    fontSize: fontSize.lg,
    letterSpacing: 1.2,
  },
  score: {
    fontSize: fontSize.score,
    fontWeight: fontWeight.black,
    lineHeight: fontSize.score + 4,
    fontVariant: ['tabular-nums'],
  },
  scoreLandscape: {
    fontSize: 104,
    lineHeight: 106,
  },
  serveWrap: { alignItems: 'center', gap: 4 },
  serveWrapLandscape: { gap: 2 },
  serveBadge: {
    borderRadius: radius.pill,
    paddingHorizontal: space['4'],
    paddingVertical: 6,
    maxWidth: '100%',
    alignItems: 'center',
  },
  serveBadgeLandscape: {
    paddingHorizontal: space['4'],
    paddingVertical: 5,
  },
  serveBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.4,
  },
  serveBadgeTextLandscape: {
    fontSize: fontSize.sm,
    letterSpacing: 0.5,
  },
  courtText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 0.6,
  },
  courtTextLandscape: {
    fontSize: fontSize.sm,
    letterSpacing: 0.8,
  },
  serveSpacer: { height: 53 },
  serveSpacerLandscape: { height: 44 },
  tapHint: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.5,
    opacity: 0.75,
    textAlign: 'center',
  },
});
