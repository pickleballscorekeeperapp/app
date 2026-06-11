import React, { useEffect, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import * as Haptics from 'expo-haptics';
import {
  isGamePoint,
  reachedSwitchPoint,
  replay,
  scoreCall,
  servesFromRight,
  switchEndsScore,
  type TeamId,
} from '@/domain/scoring';
import { useGameStore } from '@/store/gameStore';
import { newGameId, useHistoryStore } from '@/store/historyStore';
import { TeamPanel } from '@/components/TeamPanel';
import { colors, fontSize, fontWeight, minTouch, radius, space } from '@/theme';
import type { RootNav } from '@/navigation/types';

export function GameScreen() {
  useKeepAwake(); // courtside phones must not sleep mid-game
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();

  const { config, events, startedAt, switchBannerDismissed } = useGameStore();
  const rally = useGameStore((s) => s.rally);
  const undo = useGameStore((s) => s.undo);
  const dismissSwitchBanner = useGameStore((s) => s.dismissSwitchBanner);
  const clearGame = useGameStore((s) => s.clearGame);
  const addGame = useHistoryStore((s) => s.addGame);

  const state = useMemo(
    () => (config ? replay(events, config) : null),
    [events, config],
  );

  useEffect(() => {
    if (!config) {
      // No active game (e.g. stale relaunch) — bounce home.
      nav.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [config, nav]);

  if (!config || !state) return null;

  const onRally = (winner: TeamId) => {
    if (winner === state.servingTeam) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    rally(winner);
  };

  const saveAndExit = () => {
    addGame({
      id: newGameId(),
      endedAt: new Date().toISOString(),
      startedAt,
      config,
      scoreA: state.scoreA,
      scoreB: state.scoreB,
      winner: state.winner,
      rallies: state.rallies,
    });
    clearGame();
    nav.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const onEndGame = () => {
    if (state.gameOver) {
      saveAndExit();
      return;
    }
    Alert.alert(
      'End game?',
      `Score is ${state.scoreA}–${state.scoreB}. Save it to history?`,
      [
        { text: 'Keep Playing', style: 'cancel' },
        { text: 'Save & End', onPress: saveAndExit },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            clearGame();
            nav.reset({ index: 0, routes: [{ name: 'Home' }] });
          },
        },
      ],
    );
  };

  const gamePoint = isGamePoint(state, config);
  const showSwitchBanner =
    !switchBannerDismissed && !state.gameOver && reachedSwitchPoint(state, config);
  const winnerName =
    state.winner === 'A' ? config.teamAName : config.teamBName;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space['2'] }]}>
      {/* The product: the official call, huge, always current. */}
      <View style={styles.callWrap}>
        <Text style={styles.callLabel}>THE CALL</Text>
        <Text style={styles.call} accessibilityLiveRegion="polite">
          {scoreCall(state).split('-').join(' – ')}
        </Text>
        <Text style={styles.callSub}>
          SERVING SCORE – RECEIVING SCORE – SERVER #
        </Text>
        {gamePoint && (
          <View style={styles.gamePointBadge}>
            <Text style={styles.gamePointText}>GAME POINT</Text>
          </View>
        )}
      </View>

      {showSwitchBanner && (
        <Pressable
          style={styles.switchBanner}
          onPress={dismissSwitchBanner}
          accessibilityRole="button"
          accessibilityLabel="Dismiss switch ends reminder"
        >
          <Text style={styles.switchBannerText}>
            ↔ First team reached {switchEndsScore(config)} — switch ends (tournament
            play). Tap to dismiss.
          </Text>
        </Pressable>
      )}

      <View style={styles.panels}>
        <TeamPanel
          team="A"
          name={config.teamAName}
          score={state.scoreA}
          isServing={state.servingTeam === 'A'}
          serverNumber={state.serverNumber}
          servesFromRight={servesFromRight(state)}
          disabled={state.gameOver}
          onWinRally={() => onRally('A')}
        />
        <TeamPanel
          team="B"
          name={config.teamBName}
          score={state.scoreB}
          isServing={state.servingTeam === 'B'}
          serverNumber={state.serverNumber}
          servesFromRight={servesFromRight(state)}
          disabled={state.gameOver}
          onWinRally={() => onRally('B')}
        />
      </View>

      {state.gameOver && (
        <View style={styles.winBanner}>
          <Text style={styles.winText}>
            🏆 {winnerName} wins {state.scoreA}–{state.scoreB}
          </Text>
        </View>
      )}

      <View style={[styles.actions, { paddingBottom: insets.bottom + space['4'] }]}>
        <Pressable
          disabled={events.length === 0}
          onPress={() => {
            Haptics.selectionAsync();
            undo();
          }}
          accessibilityRole="button"
          accessibilityLabel="Undo last rally"
          accessibilityState={{ disabled: events.length === 0 }}
          style={({ pressed }) => [
            styles.subBtn,
            events.length === 0 && styles.subBtnDisabled,
            pressed && styles.subBtnPressed,
          ]}
        >
          <Text
            style={[
              styles.subBtnLabel,
              events.length === 0 && styles.subBtnLabelDisabled,
            ]}
          >
            ↶  UNDO
          </Text>
        </Pressable>

        <Pressable
          onPress={onEndGame}
          accessibilityRole="button"
          accessibilityLabel={state.gameOver ? 'Save game and return home' : 'End game'}
          style={({ pressed }) => [
            styles.subBtn,
            state.gameOver && styles.subBtnPrimary,
            pressed && styles.subBtnPressed,
          ]}
        >
          <Text
            style={[styles.subBtnLabel, state.gameOver && styles.subBtnLabelPrimary]}
          >
            {state.gameOver ? 'SAVE & DONE' : 'END GAME'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space['4'] },
  callWrap: { alignItems: 'center', marginBottom: space['3'] },
  callLabel: {
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  call: {
    color: colors.text,
    fontSize: fontSize.call,
    fontWeight: fontWeight.black,
    fontVariant: ['tabular-nums'],
    lineHeight: fontSize.call + 6,
  },
  callSub: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.4,
  },
  gamePointBadge: {
    marginTop: space['2'],
    backgroundColor: colors.ball,
    borderRadius: radius.pill,
    paddingHorizontal: space['4'],
    paddingVertical: space['1'],
  },
  gamePointText: {
    color: '#FFFFFF',
    fontSize: fontSize.sm,
    fontWeight: fontWeight.black,
    letterSpacing: 1.5,
  },
  switchBanner: {
    backgroundColor: colors.ballSoft,
    borderRadius: radius.md,
    padding: space['3'],
    marginBottom: space['3'],
  },
  switchBannerText: {
    color: colors.text2,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  panels: { flex: 1, flexDirection: 'row', gap: space['3'] },
  winBanner: {
    backgroundColor: colors.greenSoft,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.green,
    padding: space['4'],
    marginTop: space['3'],
    alignItems: 'center',
  },
  winText: {
    color: colors.green,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
  },
  actions: { flexDirection: 'row', gap: space['3'], marginTop: space['3'] },
  subBtn: {
    flex: 1,
    minHeight: minTouch + 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.text,
  },
  subBtnPrimary: { backgroundColor: colors.green, borderColor: colors.green },
  subBtnPressed: { opacity: 0.8 },
  subBtnDisabled: { opacity: 0.4 },
  subBtnLabel: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  subBtnLabelPrimary: { color: '#FFFFFF' },
  subBtnLabelDisabled: { color: colors.textDim },
});
