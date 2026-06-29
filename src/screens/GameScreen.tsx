import React, { useEffect, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
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
import { AdBanner } from '@/components/AdBanner';
import { useUnlockedOrientation } from '@/hooks/useScreenOrientation';
import { colors, fontSize, fontWeight, minTouch, radius, space } from '@/theme';
import type { RootNav } from '@/navigation/types';

export function GameScreen() {
  useKeepAwake(); // courtside phones must not sleep mid-game
  useUnlockedOrientation();
  const nav = useNavigation<RootNav>();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

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
  const isLandscape = width > height;
  const callText = scoreCall(state).split('-').join(' – ');

  if (isLandscape) {
    return (
      <View
        style={[
          styles.landscapeScreen,
          {
            paddingTop: insets.top + space['2'],
            paddingRight: insets.right + space['3'],
            paddingBottom: insets.bottom + space['2'],
            paddingLeft: insets.left + space['3'],
          },
        ]}
      >
        <StatusBar hidden />

        <View style={styles.landscapeCallWrap}>
          <Text style={styles.landscapeCallLabel}>THE CALL</Text>
          <Text style={styles.landscapeCall} accessibilityLiveRegion="polite">
            {callText}
          </Text>
          <Text style={styles.landscapeCallSub}>SERVING – RECEIVING – SERVER #</Text>
          {gamePoint && (
            <View style={styles.landscapeGamePointBadge}>
              <Text style={styles.landscapeGamePointText}>GAME POINT</Text>
            </View>
          )}
        </View>

        {showSwitchBanner && (
          <Pressable
            style={styles.landscapeSwitchBanner}
            onPress={dismissSwitchBanner}
            accessibilityRole="button"
            accessibilityLabel="Dismiss switch ends reminder"
          >
            <Text style={styles.switchBannerText}>
              Switch ends at {switchEndsScore(config)}. Tap to dismiss.
            </Text>
          </Pressable>
        )}

        <View style={styles.landscapePanels}>
          <TeamPanel
            team="A"
            name={config.teamAName}
            score={state.scoreA}
            isServing={state.servingTeam === 'A'}
            serverNumber={state.serverNumber}
            servesFromRight={servesFromRight(state)}
            disabled={state.gameOver}
            presentation="landscape"
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
            presentation="landscape"
            onWinRally={() => onRally('B')}
          />
        </View>

        {state.gameOver && (
          <View style={styles.landscapeWinBanner}>
            <Text style={styles.landscapeWinText}>
              {winnerName} wins {state.scoreA}–{state.scoreB}
            </Text>
          </View>
        )}

        <View style={styles.landscapeActions}>
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
              styles.landscapeSubBtn,
              events.length === 0 && styles.subBtnDisabled,
              pressed && styles.subBtnPressed,
            ]}
          >
            <Text
              style={[
                styles.landscapeSubBtnLabel,
                events.length === 0 && styles.subBtnLabelDisabled,
              ]}
            >
              ↶ UNDO
            </Text>
          </Pressable>

          <Pressable
            onPress={onEndGame}
            accessibilityRole="button"
            accessibilityLabel={state.gameOver ? 'Save game and return home' : 'End game'}
            style={({ pressed }) => [
              styles.landscapeSubBtn,
              state.gameOver && styles.subBtnPrimary,
              pressed && styles.subBtnPressed,
            ]}
          >
            <Text
              style={[
                styles.landscapeSubBtnLabel,
                state.gameOver && styles.subBtnLabelPrimary,
              ]}
            >
              {state.gameOver ? 'SAVE & DONE' : 'END GAME'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space['2'] }]}>
      <StatusBar style="dark" backgroundColor={colors.bg} hidden={false} />
      {/* The product: the official call, huge, always current. */}
      <View style={styles.callWrap}>
        <Text style={styles.callLabel}>THE CALL</Text>
        <Text style={styles.call} accessibilityLiveRegion="polite">
          {callText}
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

      <AdBanner style={styles.gameAd} />

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
  landscapeScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    gap: space['1'],
  },
  callWrap: { alignItems: 'center', marginBottom: space['3'] },
  landscapeCallWrap: {
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callLabel: {
    color: colors.textDim,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: 2,
  },
  landscapeCallLabel: {
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
  landscapeCall: {
    color: colors.text,
    fontSize: 74,
    fontWeight: fontWeight.black,
    fontVariant: ['tabular-nums'],
    lineHeight: 78,
  },
  callSub: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.4,
  },
  landscapeCallSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.8,
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
  landscapeGamePointBadge: {
    position: 'absolute',
    right: 0,
    top: space['2'],
    backgroundColor: colors.ball,
    borderRadius: radius.pill,
    paddingHorizontal: space['4'],
    paddingVertical: space['1'],
  },
  landscapeGamePointText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.black,
    letterSpacing: 1,
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
  landscapeSwitchBanner: {
    backgroundColor: colors.ballSoft,
    borderRadius: radius.md,
    paddingVertical: space['2'],
    paddingHorizontal: space['3'],
  },
  panels: { flex: 1, flexDirection: 'row', gap: space['3'] },
  landscapePanels: { flex: 1, flexDirection: 'row', gap: space['3'] },
  winBanner: {
    backgroundColor: colors.greenSoft,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.green,
    padding: space['4'],
    marginTop: space['3'],
    alignItems: 'center',
  },
  landscapeWinBanner: {
    position: 'absolute',
    left: space['3'],
    right: space['3'],
    bottom: 70,
    backgroundColor: colors.green,
    borderRadius: radius.lg,
    paddingVertical: space['2'],
    alignItems: 'center',
  },
  winText: {
    color: colors.green,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.black,
  },
  landscapeWinText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: fontWeight.black,
  },
  gameAd: {
    marginTop: space['3'],
    marginBottom: 0,
  },
  actions: { flexDirection: 'row', gap: space['3'], marginTop: space['3'] },
  landscapeActions: {
    flexDirection: 'row',
    gap: space['3'],
    minHeight: 42,
  },
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
  landscapeSubBtn: {
    flex: 1,
    minHeight: 42,
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
  landscapeSubBtnLabel: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.extrabold,
    letterSpacing: 1,
  },
  subBtnLabelPrimary: { color: '#FFFFFF' },
  subBtnLabelDisabled: { color: colors.textDim },
});
