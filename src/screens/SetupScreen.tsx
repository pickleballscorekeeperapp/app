import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, minTouch, radius, shadows, space } from '@/theme';
import { useGameStore } from '@/store/gameStore';
import { usePortraitOrientation } from '@/hooks/useScreenOrientation';
import { AdBanner } from '@/components/AdBanner';
import type { TeamId } from '@/domain/scoring';
import type { RootNav } from '@/navigation/types';

const POINT_OPTIONS = [11, 15, 21] as const;

export function SetupScreen() {
  usePortraitOrientation();
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const startGame = useGameStore((s) => s.startGame);

  const [teamAName, setTeamAName] = useState('');
  const [teamBName, setTeamBName] = useState('');
  const [pointsToWin, setPointsToWin] = useState<number>(11);
  const [firstServe, setFirstServe] = useState<TeamId>('A');

  const nameA = teamAName.trim() || 'Team 1';
  const nameB = teamBName.trim() || 'Team 2';

  const onStart = () => {
    startGame({
      pointsToWin,
      winBy: 2,
      firstServe,
      teamAName: nameA,
      teamBName: nameB,
    });
    nav.replace('Game');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + space['4'], paddingBottom: insets.bottom + space['6'] },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topRow}>
          <Pressable
            onPress={() => nav.goBack()}
            hitSlop={12}
            style={styles.close}
            accessibilityRole="button"
            accessibilityLabel="Close new game setup"
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.title}>New Game</Text>
          <View style={styles.closeSpacer} />
        </View>

        <Text style={styles.label}>TEAM 1 (BLUE)</Text>
        <TextInput
          style={styles.input}
          placeholder="Team 1"
          placeholderTextColor={colors.textDim}
          value={teamAName}
          onChangeText={setTeamAName}
          maxLength={18}
          returnKeyType="next"
          accessibilityLabel="Team 1 name"
        />

        <Text style={styles.label}>TEAM 2 (GREEN)</Text>
        <TextInput
          style={styles.input}
          placeholder="Team 2"
          placeholderTextColor={colors.textDim}
          value={teamBName}
          onChangeText={setTeamBName}
          maxLength={18}
          returnKeyType="done"
          accessibilityLabel="Team 2 name"
        />

        <Text style={styles.label}>GAME TO</Text>
        <View style={styles.segmentRow}>
          {POINT_OPTIONS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPointsToWin(p)}
              style={[styles.segment, pointsToWin === p && styles.segmentActive]}
              accessibilityRole="button"
              accessibilityLabel={`Game to ${p}`}
              accessibilityState={{ selected: pointsToWin === p }}
            >
              <Text
                style={[styles.segmentText, pointsToWin === p && styles.segmentTextActive]}
              >
                {p}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.hint}>Win by 2. Official games are to 11.</Text>

        <Text style={styles.label}>FIRST SERVE</Text>
        <View style={styles.segmentRow}>
          <Pressable
            onPress={() => setFirstServe('A')}
            style={[styles.segment, firstServe === 'A' && styles.segmentActiveA]}
            accessibilityRole="button"
            accessibilityLabel={`${nameA} serves first`}
            accessibilityState={{ selected: firstServe === 'A' }}
          >
            <Text
              style={[styles.segmentText, firstServe === 'A' && styles.segmentTextActive]}
              numberOfLines={1}
            >
              {nameA}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFirstServe('B')}
            style={[styles.segment, firstServe === 'B' && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityLabel={`${nameB} serves first`}
            accessibilityState={{ selected: firstServe === 'B' }}
          >
            <Text
              style={[styles.segmentText, firstServe === 'B' && styles.segmentTextActive]}
              numberOfLines={1}
            >
              {nameB}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>
          The starting team serves once only — the game opens “0-0-2.”
        </Text>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          onPress={onStart}
          accessibilityRole="button"
          accessibilityLabel="Start game"
        >
          <Text style={styles.ctaText}>START GAME</Text>
        </Pressable>

        <AdBanner />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space['5'] },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space['6'],
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated2,
  },
  closeSpacer: { width: 36 },
  closeText: { color: colors.textMuted, fontSize: 18, fontWeight: '700' },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  label: {
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
    marginBottom: space['2'],
    marginTop: space['4'],
  },
  input: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: minTouch,
    paddingHorizontal: space['4'],
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  segmentRow: { flexDirection: 'row', gap: space['2'] },
  segment: {
    flex: 1,
    minHeight: minTouch,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space['2'],
  },
  segmentActive: { backgroundColor: colors.green, borderColor: colors.green },
  segmentActiveA: { backgroundColor: colors.teamA, borderColor: colors.teamA },
  segmentText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  segmentTextActive: { color: '#FFFFFF' },
  hint: { color: colors.textDim, fontSize: fontSize.xs, marginTop: space['2'] },
  cta: {
    backgroundColor: colors.green,
    borderRadius: radius.lg,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space['7'],
    ...shadows.greenCta,
  },
  ctaPressed: { opacity: 0.85 },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    letterSpacing: 1.5,
  },
});
