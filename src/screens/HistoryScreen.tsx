import React from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, radius, space } from '@/theme';
import { useHistoryStore, type CompletedGame } from '@/store/historyStore';
import { usePortraitOrientation } from '@/hooks/useScreenOrientation';
import { AdBanner } from '@/components/AdBanner';
import type { RootNav } from '@/navigation/types';

export function HistoryScreen() {
  usePortraitOrientation();
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const games = useHistoryStore((s) => s.games);
  const removeGame = useHistoryStore((s) => s.removeGame);

  const confirmDelete = (g: CompletedGame) => {
    Alert.alert('Delete game?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeGame(g.id) },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space['4'] }]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => nav.goBack()}
          hitSlop={12}
          style={styles.close}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.closeText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Game History</Text>
        <View style={styles.closeSpacer} />
      </View>

      <FlatList
        data={games}
        keyExtractor={(g) => g.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + space['6'] }}
        ListFooterComponent={<AdBanner />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No games yet. Go play!</Text>
          </View>
        }
        renderItem={({ item: g }) => (
          <View style={styles.card}>
            <View style={styles.cardMain}>
              <Text style={styles.teams} numberOfLines={1}>
                {g.config.teamAName} vs {g.config.teamBName}
              </Text>
              <Text style={styles.score}>
                <Text style={g.winner === 'A' ? styles.winScore : undefined}>
                  {g.scoreA}
                </Text>
                {'  –  '}
                <Text style={g.winner === 'B' ? styles.winScore : undefined}>
                  {g.scoreB}
                </Text>
              </Text>
              <Text style={styles.meta}>
                {new Date(g.endedAt).toLocaleString()} · to {g.config.pointsToWin} ·{' '}
                {g.rallies} rallies
              </Text>
            </View>
            <Pressable
              onPress={() => confirmDelete(g)}
              hitSlop={8}
              style={styles.deleteBtn}
              accessibilityRole="button"
              accessibilityLabel={`Delete game ${g.config.teamAName} versus ${g.config.teamBName}`}
            >
              <Text style={styles.deleteText}>🗑</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space['5'] },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space['5'],
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
  emptyCard: {
    backgroundColor: colors.bgElevated2,
    borderRadius: radius.lg,
    padding: space['6'],
    alignItems: 'center',
  },
  emptyText: { color: colors.textDim, fontSize: fontSize.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space['4'],
    marginBottom: space['3'],
  },
  cardMain: { flex: 1 },
  teams: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  score: {
    color: colors.text,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.extrabold,
  },
  winScore: { color: colors.green },
  meta: { color: colors.textDim, fontSize: fontSize.xs, marginTop: 2 },
  deleteBtn: { padding: space['2'] },
  deleteText: { fontSize: 18, opacity: 0.6 },
});
