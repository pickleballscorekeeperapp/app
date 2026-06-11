/**
 * Live game store — Zustand + AsyncStorage persistence.
 * Mirrors CourtsideView's liveMatchStore pattern: the store holds the raw
 * event log; UI derives GameState via replay(). Persisting events (not
 * derived state) makes undo trivial and survives force-quits mid-game.
 *
 * AsyncStorage (not MMKV) on purpose: zero native config, works in Expo Go.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameConfig, RallyEvent, TeamId } from '@/domain/scoring';

interface LiveGameStore {
  config: GameConfig | null;
  events: RallyEvent[];
  startedAt: string | null;
  switchBannerDismissed: boolean;

  startGame: (config: GameConfig) => void;
  rally: (winner: TeamId) => void;
  undo: () => void;
  dismissSwitchBanner: () => void;
  clearGame: () => void;
}

export const useGameStore = create<LiveGameStore>()(
  persist(
    (set, get) => ({
      config: null,
      events: [],
      startedAt: null,
      switchBannerDismissed: false,

      startGame: (config) =>
        set({
          config,
          events: [],
          startedAt: new Date().toISOString(),
          switchBannerDismissed: false,
        }),

      rally: (winner) =>
        set({
          events: [...get().events, { winner, at: new Date().toISOString() }],
        }),

      undo: () => set({ events: get().events.slice(0, -1) }),

      dismissSwitchBanner: () => set({ switchBannerDismissed: true }),

      clearGame: () =>
        set({
          config: null,
          events: [],
          startedAt: null,
          switchBannerDismissed: false,
        }),
    }),
    {
      name: 'psk_live_game',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
