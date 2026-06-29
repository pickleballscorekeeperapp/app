import React from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, families, fontSize, fontWeight, radius, shadows, space } from '@/theme';
import { useGameStore } from '@/store/gameStore';
import { useHistoryStore } from '@/store/historyStore';
import { replay, scoreCall } from '@/domain/scoring';
import { usePortraitOrientation } from '@/hooks/useScreenOrientation';
import type { RootNav } from '@/navigation/types';

export function HomeScreen() {
  usePortraitOrientation();
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const { config, events } = useGameStore();
  const games = useHistoryStore((s) => s.games);
  const recent = games.slice(0, 3);

  const live = config ? replay(events, config) : null;
  const hasLiveGame = config != null && live != null && !live.gameOver;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + space['6'], paddingBottom: insets.bottom + space['6'] },
      ]}
    >
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={styles.wordmarkWrap} accessible accessibilityRole="header">
            <Text
              style={styles.wordmarkTop}
              numberOfLines={1}
            >
              Easy Pickleball
            </Text>
            <Text
              style={styles.wordmarkBottom}
              numberOfLines={1}
            >
              Scoreboard
            </Text>
            <View style={styles.wordmarkAccent} />
          </View>
        </View>
        <Text style={styles.title}>Side-out scoring made simple</Text>
        <Text style={styles.subtitle}>
          Official USA Pickleball side-out scoring. Never wonder what the call is.
        </Text>
      </View>

      {hasLiveGame && config && live && (
        <Pressable
          style={styles.resumeCard}
          onPress={() => nav.navigate('Game')}
          accessibilityRole="button"
          accessibilityLabel={`Resume game. Current call ${scoreCall(live)}`}
        >
          <View style={styles.resumeBadge}>
            <Text style={styles.resumeBadgeText}>GAME IN PROGRESS</Text>
          </View>
          <Text style={styles.resumeScore}>
            {config.teamAName} {live.scoreA} — {live.scoreB} {config.teamBName}
          </Text>
          <Text style={styles.resumeCall}>Call: {scoreCall(live)}</Text>
          <Text style={styles.resumeCta}>TAP TO RESUME →</Text>
        </Pressable>
      )}

      <Pressable
        style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
        onPress={() => nav.navigate('Setup')}
        accessibilityRole="button"
        accessibilityLabel="Start a new game"
      >
        <Text style={styles.ctaText}>NEW GAME</Text>
      </Pressable>

      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>RECENT GAMES</Text>
        {games.length > 0 && (
          <Pressable
            onPress={() => nav.navigate('History')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="See all game history"
          >
            <Text style={styles.seeAll}>SEE ALL</Text>
          </Pressable>
        )}
      </View>

      {recent.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Finished games show up here automatically.
          </Text>
        </View>
      ) : (
        recent.map((g) => (
          <View key={g.id} style={styles.gameCard}>
            <Text style={styles.gameTeams} numberOfLines={1}>
              {g.config.teamAName} vs {g.config.teamBName}
            </Text>
            <Text style={styles.gameScore}>
              <Text style={g.winner === 'A' ? styles.winScore : undefined}>{g.scoreA}</Text>
              {'  –  '}
              <Text style={g.winner === 'B' ? styles.winScore : undefined}>{g.scoreB}</Text>
            </Text>
            <Text style={styles.gameDate}>
              {new Date(g.endedAt).toLocaleDateString()} · to {g.config.pointsToWin}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.poweredBy}>Powered by CourtsideView</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space['5'] },
  hero: {
    marginBottom: space['6'],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['4'],
    marginBottom: space['4'],
  },
  logo: {
    width: 82,
    height: 82,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.green,
    ...shadows.card,
  },
  wordmarkWrap: {
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
    paddingTop: space['2'],
    paddingBottom: space['2'],
  },
  wordmarkTop: {
    color: colors.green,
    fontFamily: Platform.select({
      ios: 'SavoyeLetPlain',
      default: families.display,
    }),
    fontSize: 36,
    fontWeight: fontWeight.regular,
    lineHeight: 44,
    textShadowColor: 'rgba(32, 166, 107, 0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  wordmarkBottom: {
    color: colors.text,
    fontFamily: Platform.select({
      ios: 'SavoyeLetPlain',
      default: families.display,
    }),
    fontSize: 43,
    fontWeight: fontWeight.regular,
    lineHeight: 50,
    marginTop: -15,
  },
  wordmarkAccent: {
    width: 150,
    height: 5,
    backgroundColor: colors.ballBright,
    borderRadius: radius.pill,
    marginLeft: space['2'],
    marginTop: -5,
    transform: [{ rotate: '-2deg' }],
  },
  title: {
    fontFamily: families.display,
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1.2,
    lineHeight: 16,
    marginTop: space['2'],
    marginBottom: space['1'],
    textTransform: 'uppercase',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 19,
  },
  resumeCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.green,
    padding: space['4'],
    marginBottom: space['4'],
    ...shadows.card,
  },
  resumeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.greenSoft,
    borderRadius: radius.pill,
    paddingHorizontal: space['3'],
    paddingVertical: space['1'],
    marginBottom: space['2'],
  },
  resumeBadgeText: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1.2,
  },
  resumeScore: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
  resumeCall: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  resumeCta: {
    color: colors.green,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
    marginTop: space['3'],
  },
  cta: {
    backgroundColor: colors.green,
    borderRadius: radius.lg,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space['7'],
    ...shadows.greenCta,
  },
  ctaPressed: { opacity: 0.85 },
  ctaText: {
    color: '#FFFFFF',
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
    letterSpacing: 1.5,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space['3'],
  },
  sectionTitle: {
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.5,
  },
  seeAll: {
    color: colors.green,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  emptyCard: {
    backgroundColor: colors.bgElevated2,
    borderRadius: radius.lg,
    padding: space['5'],
    alignItems: 'center',
  },
  emptyText: { color: colors.textDim, fontSize: fontSize.sm },
  gameCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space['4'],
    marginBottom: space['3'],
  },
  gameTeams: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  gameScore: {
    color: colors.text,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
  },
  winScore: { color: colors.green },
  gameDate: { color: colors.textDim, fontSize: fontSize.xs, marginTop: 2 },
  poweredBy: {
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.6,
    marginTop: space['5'],
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
